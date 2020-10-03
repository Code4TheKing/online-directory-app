/** @format */

import { withAuthenticationRequired } from '@auth0/auth0-react';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { Route } from 'react-router-dom';

const PrivateRoute = ({ component, ...args }) => (
  <Route
    component={withAuthenticationRequired(component, {
      onRedirecting: () => (
        <Row className='justify-content-center'>
          <Spinner animation='border' variant='primary' />
        </Row>
      )
    })}
    {...args}
  />
);

export default PrivateRoute;
