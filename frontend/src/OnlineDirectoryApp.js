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
import Profile from './pages/Profile';
import Search from './pages/Search';
import NotFound from './pages/NotFound';
import { createProfileContactAsync, getProfileContactAsync } from "./redux/actions";

const OnlineDirectoryApp = ({ getProfileContactError, isAdmin, profileContact, getProfileContact, createProfileContact }) => {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently()
        .then(token => getProfileContact(token));
    }
  }, [isAuthenticated, getAccessTokenSilently, getProfileContact]);

  useEffect(() => {
    if (getProfileContactError?.statusCode === 404) {
      if (isAuthenticated) {
        getAccessTokenSilently()
          .then(token => createProfileContact(token));
      }
    }
  }, [getProfileContactError, isAuthenticated, getAccessTokenSilently, createProfileContact]);

  if (isLoading || (isAuthenticated && isAdmin === null)) {
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
  getProfileContactError: state.profileContacts.getProfileContactError,
  isAdmin: state.profileContacts.isAdmin,
  profileContact: state.profileContacts.profileContact
});

const mapDispatchToProps = (dispatch) => ({
  getProfileContact: (token) => dispatch(getProfileContactAsync(token)),
  createProfileContact: (token) => dispatch(createProfileContactAsync(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(OnlineDirectoryApp);
