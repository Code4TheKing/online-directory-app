import { useAuth0 } from '@auth0/auth0-react';
import React, { Fragment, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavigationBar from './components/NavigationBar';
import PrivateRoute from './components/PrivateRoute';
import Admin from './pages/Admin';
import Directory from './pages/Directory';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import { createProfileContactAsync, getFieldDefinitionsAsync, getProfileContactAsync } from './redux/actions';

export const HOME_PATH = '/';
export const DIRECTORY_PATH = '/directory';
export const DIRECTORY_SEARCH_BY_NAME_PATH = '/directory/name';
export const DIRECTORY_SEARCH_BY_KEYWORD_PATH = '/directory/keyword';
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
  isGettingProfileContact,
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

  if (isLoading || isGettingFieldDefinitions || isGettingProfileContact || (isAuthenticated && isAdmin === null)) {
    return (
      <Fragment>
        <NavigationBar />
        <Container className="mt-3" fluid>
          <Container className="d-flex justify-content-center align-items-center vw-100 vh-100">
            <Spinner animation="border" variant="primary" />
          </Container>
        </Container>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <NavigationBar fieldDefinitions={fieldDefinitions} profileContact={profileContact} isAdmin={isAdmin} />
      <ToastContainer />
      <Container className="mt-3" fluid>
        <Switch>
          <Route path={HOME_PATH} component={Home} exact />
          <PrivateRoute path={DIRECTORY_PATH} component={Directory} />
          <PrivateRoute path={ADMIN_PATH} component={Admin} />
          <PrivateRoute path={PROFILE_PATH} component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </Container>
    </Fragment>
  );
}

const mapStateToProps = (state) => ({
  fieldDefinitions: state.contacts.fieldDefinitions,
  isGettingFieldDefinitions: state.contacts.isGettingFieldDefinitions,
  isGettingProfileContact: state.profileContacts.isGettingProfileContact,
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
