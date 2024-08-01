import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function CartItems() {
    const { nic } = useParams();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`http://localhost:8070/addCart/cartItems/${nic}`);
                console.log('Cart items:', response.data.data); // Log the response to check the data
                setCartItems(response.data.data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setError('Error fetching cart items');
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [nic]);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div>
                    <h2>Cart Items</h2>
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.foodId._id}>
                                <p>Food Name: {item.foodId.foodname}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ${item.foodId.price}</p>
                                <p>Total Price: ${(item.foodId.price * item.quantity).toFixed(2)}</p>
                                {item.foodId.imageUrl ? (
                                    <img
                                        src={item.foodId.imageUrl}
                                        alt={item.foodId.foodname}
                                        className="food-image"
                                        onError={(e) => console.error('Error loading image:', e)}
                                        width="100"
                                    />
                                ) : (
                                    <p>No image available</p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default CartItems;
