import { withAuthenticationRequired } from '@auth0/auth0-react';
import { CircularProgress } from '@material-ui/core';
import React from 'react';
import Container from 'react-bootstrap/Container';
import { Route } from 'react-router-dom';

const PrivateRoute = ({ component, ...args }) => (
  <Route
    component={
      withAuthenticationRequired(
        component,
        {
          onRedirecting: () => (
            <Container className="d-flex justify-content-center">
              <CircularProgress className="w-25 h-25" />
            </Container>
          )
        })}
    {...args}
  />
);

export default PrivateRoute;
