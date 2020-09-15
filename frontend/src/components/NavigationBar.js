/** @format */

import { useAuth0 } from '@auth0/auth0-react';
import { Avatar } from '@material-ui/core';
import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import { useLocation } from 'react-router-dom';
import { ADMIN_PATH, DIRECTORY_PATH, HOME_PATH, PROFILE_PATH } from '../OnlineDirectoryApp';
import LogoutButton from './LogoutButton';

const NavigationBar = ({ fieldDefinitions, profileContact, isAdmin }) => {
  const { isAuthenticated } = useAuth0();
  const location = useLocation();
  const generateAvatarText = (fieldDefinitions, profileContact) =>
    profileContact[fieldDefinitions.mainField.propName]
      .split(/\s+/)
      .map((word) => {
        const letter = word.charAt(0).toUpperCase();
        return /[A-Za-z]/.test(letter) ? letter : '';
      })
      .join('')
      .slice(0, 2);

  return (
    <Navbar bg='dark' variant='dark' sticky='top' expand='md' collapseOnSelect>
      <Navbar.Brand className='align-self-center' href={HOME_PATH}>
        {process.env.REACT_APP_WEBSITE_NAME}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='navbar' />
      <Navbar.Collapse id='navbar'>
        <Nav className='w-100'>
          <Nav.Item className='align-self-center'>
            <IndexLinkContainer to={HOME_PATH}>
              <Nav.Link active={location.pathname === HOME_PATH}>Home</Nav.Link>
            </IndexLinkContainer>
          </Nav.Item>
          {isAuthenticated && (
            <Nav.Item className='align-self-center'>
              <LinkContainer to={DIRECTORY_PATH}>
                <Nav.Link active={location.pathname.startsWith(DIRECTORY_PATH)}>Directory</Nav.Link>
              </LinkContainer>
            </Nav.Item>
          )}
          {isAuthenticated && isAdmin && (
            <Nav.Item className='align-self-center'>
              <LinkContainer to={ADMIN_PATH}>
                <Nav.Link active={location.pathname.startsWith(ADMIN_PATH)}>Admin</Nav.Link>
              </LinkContainer>
            </Nav.Item>
          )}
          <Nav.Item className='flex-grow-1' />
          {isAuthenticated && fieldDefinitions && profileContact && (
            <Nav.Item className='align-self-center'>
              <LinkContainer to={PROFILE_PATH}>
                <Nav.Link
                  className='d-inline-flex border border-secondary rounded-pill mx-2 my-2'
                  active={location.pathname === PROFILE_PATH}>
                  <Avatar className='mr-1' style={{ width: 35, height: 35 }}>
                    {generateAvatarText(fieldDefinitions, profileContact)
                      ? generateAvatarText(fieldDefinitions, profileContact)
                      : 'XX'}
                  </Avatar>
                  <span className='align-self-center'>
                    <u>{profileContact[fieldDefinitions.mainField.propName]}</u>
                  </span>
                </Nav.Link>
              </LinkContainer>
            </Nav.Item>
          )}
          <Nav.Item className='align-self-center'>{isAuthenticated && <LogoutButton />}</Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
