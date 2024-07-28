import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./AllFood.css";
import FoodSearch from '../SearchBar/FoodSearch';
import Footer from '../footer/footer';

function AllFoods() {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const loggedInUserNIC = localStorage.getItem('loggedInUserNIC'); // Retrieve the logged-in user's NIC from local storage

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost:8070/food/fetch');
                setFoods(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching foods:', error);
                setError(error);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleAddToCart = (foodId) => {

        if (loggedInUserNIC) {
            // User is logged in, navigate to add to cart page
            navigate(`/addItem/${loggedInUserNIC}/${foodId}`);
        } else {
            // User is not logged in, navigate to login page
            navigate('/loginCus');
        }
        // Pass the loggedInUserNIC along with the foodId
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="all-foods-container">
            <br />
            <div className="search">
                <FoodSearch />
            </div>
            <h2>All Foods</h2>
            <ul className="food-list">
                {foods.map((food) => (
                    <li key={food._id} className="food-item">
                        {food.imageUrl && (
                            <img
                                src={food.imageUrl}
                                alt={food.foodname}
                                className="food-image"
                                onError={(e) => console.error('Error loading image:', e)}
                            />
                        )}
                        <div className="food-details">
                            <div className="foodname">{food.foodname}</div>
                            <div className="food-price">Price: {food.price}</div>
                            <div className="food-description">{food.description}</div>
                        </div>
                        <button onClick={() => handleAddToCart(food._id)} className ="btnAdd">Add Cart</button>
                    </li>
                ))}
            </ul>
            <Footer />
        </div>
    );
}

export default AllFoods;
