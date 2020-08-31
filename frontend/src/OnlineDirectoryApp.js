import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress } from '@material-ui/core';
import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import PrivateRoute from './components/PrivateRoute';
import Admin from './pages/Admin';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Search from './pages/Search';
import { createProfileContactAsync, getFieldDefinitionsAsync, getProfileContactAsync } from './redux/actions';

const OnlineDirectoryApp = ({
  isGettingFieldDefinitions,
  getProfileContactError,
  isAdmin,
  profileContact,
  getFieldDefinitions,
  getProfileContact,
  createProfileContact
}) => {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently()
        .then(token => getFieldDefinitions(token));
      getAccessTokenSilently()
        .then(token => getProfileContact(token));
    }
  }, [isAuthenticated, getAccessTokenSilently, getFieldDefinitions, getProfileContact]);

  useEffect(() => {
    if (getProfileContactError?.statusCode === 404) {
      if (isAuthenticated) {
        getAccessTokenSilently()
          .then(token => createProfileContact(token));
      }
    }
  }, [getProfileContactError, isAuthenticated, getAccessTokenSilently, createProfileContact]);

  if (isLoading || isGettingFieldDefinitions || (isAuthenticated && isAdmin === null)) {
    return (
      <Container className="d-flex justify-content-center">
        <CircularProgress className="w-25 h-25" />
      </Container>
    );
  }

  return (
    <>
      <NavigationBar profileContact={profileContact} isAdmin={isAdmin} />
      <Jumbotron>
        <Switch>
          <Route path="/" component={Home} exact />
          <PrivateRoute path="/search" component={Search} />
          {isAdmin && <PrivateRoute path="/admin" component={Admin} />}
          <PrivateRoute path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </Jumbotron>
    </>
  );
}

const mapStateToProps = (state) => ({
  fieldDefinitions: state.contacts.fieldDefinitions,
  isGettingFieldDefinitions: state.contacts.isGettingFieldDefinitions,
  getProfileContactError: state.profileContacts.getProfileContactError,
  isAdmin: state.profileContacts.isAdmin,
  profileContact: state.profileContacts.profileContact
});

const mapDispatchToProps = (dispatch) => ({
  getFieldDefinitions: (token) => dispatch(getFieldDefinitionsAsync(token)),
  getProfileContact: (token) => dispatch(getProfileContactAsync(token)),
  createProfileContact: (token) => dispatch(createProfileContactAsync(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(OnlineDirectoryApp);
