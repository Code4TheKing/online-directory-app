import { useAuth0 } from '@auth0/auth0-react';
import { CircularProgress } from '@material-ui/core';
import React from 'react';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import LoginButton from '../components/LoginButton';

const Home = ({ fieldDefinitions, profileContact, isGettingFieldDefinitions, isGettingProfileContact }) => {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return (
      <>
        <Row className="justify-content-center text-center">
          <h1>Welcome to the {process.env.REACT_APP_WEBSITE_NAME}</h1>
        </Row>
        <Row className="justify-content-center mt-3">
          <LoginButton />
        </Row>
      </>
    );
  }

  return (
    <Row className="justify-content-center text-center">
      {isGettingFieldDefinitions || isGettingProfileContact ?
        <CircularProgress /> :
        <h2>Hello, {profileContact[fieldDefinitions.mainField.propName]}!</h2>}
    </Row>
  );
}

const mapStateToProps = (state) => ({
  fieldDefinitions: state.contacts.fieldDefinitions,
  profileContact: state.profileContacts.profileContact,
  isGettingFieldDefinitions: state.contacts.isGettingFieldDefinitions,
  isGettingProfileContact: state.profileContacts.isGettingProfileContact
});

export default connect(mapStateToProps)(Home);
