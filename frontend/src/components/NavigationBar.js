import { useAuth0 } from '@auth0/auth0-react';
import { Avatar } from '@material-ui/core';
import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import { useLocation } from 'react-router-dom';
import {
  ADMIN_ADD_CONTACT_PATH, ADMIN_EDIT_CONTACT_PATH, ADMIN_PATH,
  HOME_PATH, PROFILE_PATH,
  SEARCH_BY_KEYWORD_PATH, SEARCH_BY_NAME_PATH, SEARCH_PATH
} from '../OnlineDirectoryApp';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

const NavigationBar = ({ fieldDefinitions, profileContact, isAdmin }) => {
  const { isAuthenticated } = useAuth0();
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark" sticky="top" expand="md">
      <Navbar.Brand className="align-self-center" href="/">Online Directory App</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar" />
      <Navbar.Collapse id="navbar">
        <Nav className="w-100">
          <Nav.Item className="align-self-center">
            <IndexLinkContainer to="/">
              <Nav.Link active={location.pathname === HOME_PATH}>Home</Nav.Link>
            </IndexLinkContainer>
          </Nav.Item>
          {isAuthenticated &&
            <NavDropdown className="align-self-center" active={location.pathname.startsWith(SEARCH_PATH)} title="Search" id="search-dropdown">
              <LinkContainer to={`${SEARCH_PATH}${SEARCH_BY_NAME_PATH}`}>
                <NavDropdown.Item active={location.pathname === `${SEARCH_PATH}${SEARCH_BY_NAME_PATH}`}>Search by name</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to={`${SEARCH_PATH}${SEARCH_BY_KEYWORD_PATH}`}>
                <NavDropdown.Item active={location.pathname === `${SEARCH_PATH}${SEARCH_BY_KEYWORD_PATH}`}>Search by keyword</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>}
          {isAuthenticated && isAdmin &&
            <NavDropdown className="align-self-center" active={location.pathname.startsWith(ADMIN_PATH)} title="Admin" id="admin-dropdown">
              <LinkContainer to={`${ADMIN_PATH}${ADMIN_ADD_CONTACT_PATH}`}>
                <NavDropdown.Item active={location.pathname === `${ADMIN_PATH}${ADMIN_ADD_CONTACT_PATH}`}>Add Contact</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to={`${ADMIN_PATH}${ADMIN_EDIT_CONTACT_PATH}`}>
                <NavDropdown.Item active={location.pathname === `${ADMIN_PATH}${ADMIN_EDIT_CONTACT_PATH}`}>Edit Contact</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>}
          <Nav.Item className="flex-grow-1" />
          {isAuthenticated && <Nav.Item className="align-self-center">
            <LinkContainer to={PROFILE_PATH}>
              <Nav.Link className="d-inline-flex" active={location.pathname === PROFILE_PATH}>
                <Avatar className="mr-1">
                  {profileContact[fieldDefinitions.mainField.propName].split(' ').map(word => word.charAt(0).toUpperCase()).join('').slice(0, 2)}
                </Avatar>
                <span className="align-self-center"><u>{profileContact[fieldDefinitions.mainField.propName]}</u></span>
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
