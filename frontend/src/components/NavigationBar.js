import { useAuth0 } from '@auth0/auth0-react';
import { Avatar } from '@material-ui/core';
import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import { useLocation } from 'react-router-dom';
import {
  ADMIN_PATH,
  HOME_PATH, PROFILE_PATH, SEARCH_PATH
} from '../OnlineDirectoryApp';
import LogoutButton from './LogoutButton';

const NavigationBar = ({ fieldDefinitions, profileContact, isAdmin }) => {
  const { isAuthenticated } = useAuth0();
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark" sticky="top" expand="md" collapseOnSelect>
      <Navbar.Brand className="align-self-center" href={HOME_PATH}>{process.env.REACT_APP_WEBSITE_NAME}</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar" />
      <Navbar.Collapse id="navbar">
        <Nav className="w-100">
          <Nav.Item className="align-self-center">
            <IndexLinkContainer to={HOME_PATH}>
              <Nav.Link active={location.pathname === HOME_PATH}>Home</Nav.Link>
            </IndexLinkContainer>
          </Nav.Item>
          {isAuthenticated &&
            <Nav.Item className="align-self-center">
              <LinkContainer to={SEARCH_PATH}>
                <Nav.Link active={location.pathname.startsWith(SEARCH_PATH)}>Search</Nav.Link>
              </LinkContainer>
            </Nav.Item>}
          {isAuthenticated && isAdmin &&
            <Nav.Item className="align-self-center">
              <LinkContainer to={ADMIN_PATH}>
                <Nav.Link active={location.pathname.startsWith(ADMIN_PATH)}>Admin</Nav.Link>
              </LinkContainer>
            </Nav.Item>}
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
            {isAuthenticated && <LogoutButton />}
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;
