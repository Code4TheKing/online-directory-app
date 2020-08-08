import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { connect } from 'react-redux';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';

const Navigation = () => (
  <>
    <Navbar bg="dark" variant="dark" expand="md">
      <Navbar.Brand href="/">Online Directory App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <IndexLinkContainer to="/">
            <Nav.Link>Home</Nav.Link>
          </IndexLinkContainer>
          <LinkContainer to="/admin">
            <Nav.Link>Admin</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
      <Navbar.Collapse className="justify-content-end">
        <Nav>
          <LinkContainer to="/profile">
            <Nav.Link active="true">Signed in as: <u>The Boilerplate Life</u></Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </>
);

export default connect()(Navigation);
