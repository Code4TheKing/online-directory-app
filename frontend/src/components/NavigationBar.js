import { useAuth0 } from "@auth0/auth0-react";
import { Avatar } from '@material-ui/core';
import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import useAdminCheck from "../hooks/UseAdminCheck";
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

const NavigationBar = () => {
  const { isAuthenticated, user } = useAuth0();
  const isAdmin = useAdminCheck(user);

  return (
    <Navbar bg="dark" variant="dark" sticky="top" expand="md">
      <Navbar.Brand className="align-self-center" href="/">Online Directory App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="w-100">
          <Nav.Item className="align-self-center">
            <IndexLinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </IndexLinkContainer>
          </Nav.Item>
          {isAuthenticated && <Nav.Item className="align-self-center">
            <IndexLinkContainer to="/search">
              <Nav.Link>Search</Nav.Link>
            </IndexLinkContainer>
          </Nav.Item>}
          {isAuthenticated && isAdmin &&
            <Nav.Item className="align-self-center">
              <LinkContainer to="/admin">
                <Nav.Link>Admin</Nav.Link>
              </LinkContainer>
            </Nav.Item>}
          <Nav.Item className="flex-grow-1" />
          {isAuthenticated && <Nav.Item>
            <LinkContainer to="/profile">
              <Nav.Link className="d-inline-flex">
                <Avatar className="mr-1">{user.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('')}</Avatar>
                <span className="align-self-center"><u>{user.name}</u></span>
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>}
          <Nav.Item className="align-self-center">
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;
