import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddCart() {
    const { nic, foodId } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [totalPrice, setTotalPrice] = useState(null);

    useEffect(() => {
        // Retrieve loggedInUserNIC from local storage
        const loggedInUserNIC = localStorage.getItem('loggedInUserNIC');
    }, []);

    const handleAddToCart = async () => {
        try {
            setLoading(true);
            // Retrieve loggedInUserNIC from local storage
            const loggedInUserNIC = localStorage.getItem('loggedInUserNIC');

            // Make sure loggedInUserNIC, nic, and foodId are defined
            if (!loggedInUserNIC || !nic || !foodId) {
                throw new Error('Invalid parameters');
            }

            const response = await axios.post(`http://localhost:8070/addCart/addItem/${loggedInUserNIC}/${foodId}`, {
                nic: loggedInUserNIC,
                foodId,
                quantity
            });
            setMessage(response.data.message);
            calculateTotalPrice(); // Calculate and display total price after adding the item
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotalPrice = async () => {
        try {
            const response = await axios.get(`http://localhost:8070/addCart/totalPrice/${nic}/66a9e0fb1eb0067ae6be79c5`);
            setTotalPrice(response.data.total_price);
        } catch (error) {
            console.error('Error calculating total price:', error);
            setTotalPrice(null);
        }
    };

    const handleremove = async () => {
        try {
            setLoading(true);
            // Retrieve loggedInUserNIC from local storage
            const loggedInUserNIC = localStorage.getItem('loggedInUserNIC');

            // Make sure loggedInUserNIC and foodId are defined
            if (!loggedInUserNIC || !foodId) {
                throw new Error('Invalid parameters');
            }

            const response = await axios.delete(`http://localhost:8070/addCart/removeItem/${loggedInUserNIC}/${foodId}`);
            setMessage(response.data.message);
            calculateTotalPrice(); // Calculate and display total price after removing the item
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
        // Any other logic for placing the order can go here
        navigate('/map');
    };

    const handleDisplayCart = () => {
        navigate(`/addCart/cartItems/${nic}`);
    };

    return (
        <div>
            <h2>Add to Cart</h2>
            <div>
                <label htmlFor="quantity">Quantity:</label>
                <input 
                    type="number" 
                    id="quantity" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)} 
                    min="1" 
                />
            </div>
            <button onClick={handleAddToCart} disabled={loading}>
                {loading ? 'Adding to Cart...' : 'Add to Cart'}
            </button>

            <button onClick={handleremove}>Remove</button> 
            <button onClick={handleViewTotal}>View Total</button>
            {message && <p>{message}</p>}
            {error && <p>Error: {error}</p>}
            {totalPrice !== null && <p>Total Price: ${totalPrice.toFixed(2)}</p>}

            <button onClick={handlePlaceOrder}>Place Order</button>
            <button onClick={handleDisplayCart}>Display Cart Items</button>
        </div>
    );
}

export default AddCart;
