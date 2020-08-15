import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';

const NavigationBar = () => (
  <Navbar bg="dark" variant="dark" sticky="top" expand="md">
    <Navbar.Brand href="/">Online Directory App</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="w-100">
        <Nav.Item>
          <IndexLinkContainer to="/">
            <Nav.Link>Home</Nav.Link>
          </IndexLinkContainer>
        </Nav.Item>
        <Nav.Item className="w-100">
          <LinkContainer to="/admin">
            <Nav.Link>Admin</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item style={{ minWidth: '16rem' }}>
          <LinkContainer to="/profile">
            <Nav.Link><span>Signed in as: </span><u>The Boilerplate Life</u></Nav.Link>
          </LinkContainer>
        </Nav.Item>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default NavigationBar;
