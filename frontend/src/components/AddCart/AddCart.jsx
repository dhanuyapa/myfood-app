import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box } from '@mui/system';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Typography, Button, TextField } from '@mui/material';

function AddCart() {
    const { nic, foodId } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [totalPrice, setTotalPrice] = useState(null);
    const [cartItemId, setCartItemId] = useState(null);
    const [foodDetails, setFoodDetails] = useState({ foodname: '', imageUrl: '' });

    useEffect(() => {
        const fetchFoodDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8070/Food/fetch/${foodId}`);
                setFoodDetails(response.data);
            } catch (error) {
                console.error('Error fetching food details:', error);
                setError('Error fetching food details');
            }
        };

        fetchFoodDetails();
    }, [foodId]);

    const handleAddToCart = async () => {
        try {
            setLoading(true);
            const loggedInUserNIC = localStorage.getItem('loggedInUserNIC');

            if (!loggedInUserNIC || !nic || !foodId) {
                throw new Error('Invalid parameters');
            }

            const response = await axios.post(`http://localhost:8070/addCart/addItem/${loggedInUserNIC}/${foodId}`, {
                nic: loggedInUserNIC,
                foodId,
                quantity
            });

            setMessage(response.data.message);
            setCartItemId(response.data.cartItemId); // Capture cartItemId from response
            calculateTotalPrice(response.data.cartItemId); // Pass cartItemId to calculateTotalPrice function
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotalPrice = async (cartItemId) => {
        try {
            const response = await axios.get(`http://localhost:8070/addCart/totalPrice/${nic}/${cartItemId}`);
            setTotalPrice(response.data.total_price);
        } catch (error) {
            console.error('Error calculating total price:', error);
            setTotalPrice(null);
        }
    };

    const handleremove = async () => {
        try {
            setLoading(true);
            const loggedInUserNIC = localStorage.getItem('loggedInUserNIC');

            if (!loggedInUserNIC || !foodId) {
                throw new Error('Invalid parameters');
            }

            const response = await axios.delete(`http://localhost:8070/addCart/removeItem/${loggedInUserNIC}/${foodId}`);
            setMessage(response.data.message);
            calculateTotalPrice(cartItemId);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewTotal = () => {
        navigate(`/totalPrice/${nic}/${cartItemId}`);
    };

    const handlePlaceOrder = () => {
        navigate('/map');
    };

    const handleDisplayCart = () => {
        navigate(`/addCart/cartItems/${nic}/${cartItemId}`);
    };

    return (
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', marginTop: '0px' }}>
            <Grid container spacing={6}>
                <Grid item xs={10} sm={12}>
                    <Paper elevation={1} sx={{ padding: '20px' }}>
                        <Typography variant="h2">Add to Cart</Typography>
                        <Typography variant="h6">Before adding to cart, please select food</Typography>
                        <img src={foodDetails.imageUrl} alt={foodDetails.foodname} style={{ width: '200px', height: '200px' }} />
                        <Typography variant="h5">{foodDetails.foodname}</Typography>
                        <div>
                            <TextField 
                                type="number" 
                                id="quantity" 
                                value={quantity} 
                                onChange={(e) => setQuantity(parseInt(e.target.value))} 
                                InputProps={{ inputProps: { min: 1 } }} 
                                disabled
                            />
                        </div>
                        <Button onClick={handleAddToCart} disabled={loading} variant="contained">
                            {loading ? 'Adding to Cart...' : 'Add to Cart'}
                        </Button>
                        <Button onClick={handleremove} variant="contained" color="secondary">Remove</Button> 
                        <Button onClick={handleViewTotal} disabled={!cartItemId} variant="contained">View Total</Button>
                        {message && <Typography variant="body1">{message}</Typography>}
                        {error && <Typography variant="body1" color="error">{error}</Typography>}
                        {totalPrice !== null && <Typography variant="h5">Total Price: ${totalPrice.toFixed(2)}</Typography>}
                        <Button onClick={handlePlaceOrder} variant="contained" color="primary">Place Order</Button>
                        <Button onClick={handleDisplayCart} disabled={!cartItemId} variant="contained">Display Cart Items</Button>
                    </Paper>
                </Grid>
                <Grid item xs={10} sm={9}>
                    <Paper elevation={3}>
                        <img src="/../home.jpg" alt="Building" style={{ width: '105%', height: '120%' }} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AddCart;
