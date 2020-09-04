import { useAuth0 } from '@auth0/auth0-react';
import { CircularProgress } from '@material-ui/core';
import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavigationBar from './components/NavigationBar';
import PrivateRoute from './components/PrivateRoute';
import AddContact from './pages/AddContact';
import EditContact from './pages/EditContact';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Search from './pages/Search';
import { createProfileContactAsync, getFieldDefinitionsAsync, getProfileContactAsync } from './redux/actions';

export const HOME_PATH = '/';
export const SEARCH_PATH = '/search';
export const ADD_CONTACT_PATH = '/add-contact';
export const EDIT_CONTACT_PATH = '/edit-contact';
export const PROFILE_PATH = '/profile';

const OnlineDirectoryApp = ({
  fieldDefinitions,
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
      <NavigationBar fieldDefinitions={fieldDefinitions} profileContact={profileContact} isAdmin={isAdmin} />
      <Jumbotron>
        <ToastContainer />
        <Switch>
          <Route path={HOME_PATH} component={Home} exact />
          <PrivateRoute path={SEARCH_PATH} component={Search} />
          {isAdmin && <PrivateRoute path={ADD_CONTACT_PATH} component={AddContact} />}
          {isAdmin && <PrivateRoute path={EDIT_CONTACT_PATH} component={EditContact} />}
          <PrivateRoute path={PROFILE_PATH} component={Profile} />
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
