import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Total() {
    const [totalPrice, setTotalPrice] = useState(null);
    const [loading, setLoading] = useState(true); // Initially set loading to true

    useEffect(() => {
        const fetchTotalPrice = async () => {
            try {
                const response = await axios.get('http://localhost:8070/totalPrice/6617efaf7308ba11e8a67627');
                setTotalPrice(response.data.total_price);
                setLoading(false); // Set loading to false after fetching the data
            } catch (error) {
                console.error('Error fetching total price:', error);
                setLoading(false); // Set loading to false even if there's an error
            }
        };

        fetchTotalPrice(); // Call the fetchTotalPrice function when the component mounts
    }, []); // Empty dependency array ensures the effect runs only once when the component mounts

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <p>Total Price: ${totalPrice}</p>
            )}
        </div>
    );
}

export default Total;