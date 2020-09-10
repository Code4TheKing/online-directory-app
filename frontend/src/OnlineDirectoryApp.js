import { useAuth0 } from '@auth0/auth0-react';
import { CircularProgress } from '@material-ui/core';
import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavigationBar from './components/NavigationBar';
import PrivateRoute from './components/PrivateRoute';
import Admin from './pages/Admin';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Search from './pages/Search';
import { createProfileContactAsync, getFieldDefinitionsAsync, getProfileContactAsync } from './redux/actions';

export const HOME_PATH = '/';
export const SEARCH_PATH = '/search';
export const SEARCH_BY_NAME_PATH = '/search/name';
export const SEARCH_BY_KEYWORD_PATH = '/search/keyword';
export const ADMIN_PATH = '/admin';
export const ADMIN_ADD_CONTACT_PATH = '/admin/add-contact';
export const ADMIN_EDIT_CONTACT_PATH = '/admin/edit-contact';
export const ADMIN_VIEW_CONTACT_PATH = '/admin/view-contact';
export const ADMIN_VIEW_CONTACT_SEARCH_BY_NAME_PATH = '/admin/view-contact/name';
export const ADMIN_VIEW_CONTACT_SEARCH_BY_KEYWORD_PATH = '/admin/view-contact/keyword';
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
      <Container className="d-flex justify-content-center align-items-center vw-100 vh-100">
        <CircularProgress className="w-25 h-auto" />
      </Container>
    );
  }

  return (
    <>
      <NavigationBar fieldDefinitions={fieldDefinitions} profileContact={profileContact} isAdmin={isAdmin} />
      <ToastContainer />
      <Container className="mt-3" fluid>
        <Switch>
          <Route path={HOME_PATH} component={Home} exact />
          <PrivateRoute path={SEARCH_PATH} component={Search} />
          {isAdmin && <PrivateRoute path={ADMIN_PATH} component={Admin} />}
          <PrivateRoute path={PROFILE_PATH} component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </Container>
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
