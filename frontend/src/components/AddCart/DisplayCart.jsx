import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import { Remove } from '@mui/icons-material';

function DisplayCart() {
    const { nic, cartItemId } = useParams();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`http://localhost:8070/addCart/cartItems/${nic}/${cartItemId}`);
                console.log('Cart items:', response.data.data); // Log the response to check the data
                setCartItems(response.data.data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setError('Error fetching cart items');
            } finally {
                setLoading(false);
            }
        };

        const fetchTotalPrice = async () => {
            try {
                const response = await axios.get(`http://localhost:8070/addCart/totalPrice/${nic}/${cartItemId}`);
                setTotalPrice(response.data.total_price);
            } catch (error) {
                console.error('Error fetching total price:', error);
                setError('Error fetching total price');
            }
        };

        fetchCartItems();
        fetchTotalPrice();
    }, [nic, cartItemId]);

    const handleRemoveItem = async (foodId) => {
        try {
            setLoading(true);
            const loggedInUserNIC = localStorage.getItem('loggedInUserNIC');

            if (!loggedInUserNIC || !foodId) {
                throw new Error('Invalid parameters');
            }

            await axios.delete(`http://localhost:8070/addCart/removeItem/${loggedInUserNIC}/${foodId}`);

            // Update the cart items after removing an item
            const updatedCartItems = cartItems.filter(item => item.foodId._id !== foodId);
            setCartItems(updatedCartItems);

            // Recalculate the total price
            const response = await axios.get(`http://localhost:8070/addCart/totalPrice/${nic}/${cartItemId}`);
            setTotalPrice(response.data.total_price);

        } catch (error) {
            console.error('Error removing item:', error);
            setError('Error removing item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Box>
                    <Typography variant="h4" gutterBottom>Cart Items</Typography>
                    <Box>
                        {cartItems.map((item) => (
                            <Card key={item.foodId._id} sx={{ display: 'flex', mb: 2 }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 100 }}
                                    image={item.foodId.imageUrl || '/path/to/placeholder-image.jpg'}
                                    alt={item.foodId.foodname}
                                    onError={(e) => {
                                        e.target.src = '/path/to/placeholder-image.jpg'; // Fallback image
                                        console.error('Error loading image:', e);
                                    }}
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <CardContent>
                                        <Typography component="div" variant="h5">
                                            {item.foodId.foodname}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                            Quantity: {item.quantity}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                            Price: ${item.foodId.price}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                            Total Price: ${(item.foodId.price * item.quantity).toFixed(2)}
                                        </Typography>
                                        <IconButton onClick={() => handleRemoveItem(item.foodId._id)} color="error">
                                            <Remove />
                                        </IconButton>
                                    </CardContent>
                                </Box>
                            </Card>
                        ))}
                    </Box>
                    {totalPrice !== null && (
                        <Typography variant="h5" gutterBottom>Total Price: ${totalPrice.toFixed(2)}</Typography>
                    )}
                </Box>
            )}
        </Box>
    );
}

export default DisplayCart;
