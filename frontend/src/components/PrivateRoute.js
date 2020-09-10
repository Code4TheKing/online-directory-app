import { withAuthenticationRequired } from '@auth0/auth0-react';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import { Route } from 'react-router-dom';

const PrivateRoute = ({ component, ...args }) => (
  <Route
    component={
      withAuthenticationRequired(
        component,
        {
          onRedirecting: () => (
            <Container className="d-flex justify-content-center">
              <Spinner className="w-25 h-auto" animation="border" variant="primary" />
            </Container>
          )
        })}
    {...args}
  />
);

export default PrivateRoute;
