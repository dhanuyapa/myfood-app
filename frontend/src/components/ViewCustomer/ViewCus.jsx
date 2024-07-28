import React from 'react';
import { useLocation } from 'react-router-dom'; // Import the useLocation hook
import Footer from '../footer/footer';

function ViewCus() {
    const { searchedCustomer } = useLocation().state;

    return (
        <div>
            <h2>View Customer</h2>
            {searchedCustomer ? (
                <div>
                <p>Name: {searchedCustomer.fname} {searchedCustomer.lname}</p>
                <p>NIC: {searchedCustomer.nic}</p>
                <p>Phone: {searchedCustomer.phone}</p>
                <p>Email: {searchedCustomer.email}</p>
                <p>No: {searchedCustomer.no}</p>
                <p>Street 1: {searchedCustomer.street1}</p>
                <p>Street 2: {searchedCustomer.street2}</p>
                <p>City: {searchedCustomer.city}</p>
                {searchedCustomer.imageUrl && (
                    <div>
                        <p>Profile Image:</p>
                        <img src={searchedCustomer.imageUrl} alt="Customer Profile" style={{ maxWidth: '200px' }} />
                    </div>
                )}
                {/* Add more details if needed */}
            </div>
            ) : (
                <p>No customer found</p>
            )}
            <Footer />
        </div>
    );
}

export default ViewCus;
