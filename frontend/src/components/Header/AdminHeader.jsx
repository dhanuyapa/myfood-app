import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import FoodSearch from '../SearchBar/FoodSearch';
import SearchCus from '../SearchBar/SearchCus';
import styled from 'styled-components';

// Styled Navbar with full width
const FullWidthNavbar = styled(Navbar)`
  width: 100vw; /* Set width to 100% of viewport width */


  padding-left: 15px; /* Add padding to compensate for negative left margin */
   /* Add padding to compensate for negative right margin */
`;

function AdminHeader() {
  return (
    <FullWidthNavbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#home" style={{ color: 'red', fontSize: '20px' }}>Yum Yard</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <Nav.Link href="/add" style={{ color: 'white',fontSize: '20px' }}>Add Food</Nav.Link>
<Nav.Link href="/hfetch" style={{ color: 'white', fontSize: '20px' }}>Edit Food</Nav.Link>
<Nav.Link href="/fetchc" style={{ color: 'white', fontSize: '20px' }}>All Customers</Nav.Link>
<Nav.Link href="/fetch" style={{ color: 'white',fontSize: '20px' }}>All Foods</Nav.Link>

           
           
          </Nav>
       
          <SearchCus />
        </Navbar.Collapse>
      </Container>
    </FullWidthNavbar>
  );
}

export default AdminHeader;
