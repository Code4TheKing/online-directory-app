import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress } from '@material-ui/core';
import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import ContactCard from '../components/ContactCard';
import { getProfileContactAsync, updateProfileContactAsync } from '../redux/actions';

const Profile = ({ profileContact, isGettingProfileContact, isUpdatingProfileContact, getProfileContact, updateProfileContact }) => {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently()
      .then(token => getProfileContact(token));
  }, [getProfileContact]);

  return (
    <Container>
      <Row className="justify-content-center">
        <h1>Profile</h1>
      </Row>
      <Row className="justify-content-center mt-3">
        {isGettingProfileContact ?
          <CircularProgress /> :
          profileContact && <ContactCard editable={true} contact={profileContact} isProcessing={isUpdatingProfileContact} saveFunc={updateProfileContact} width={'25rem'} />}
      </Row>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  profileContact: state.profileContacts.profileContact,
  isGettingProfileContact: state.profileContacts.isGettingProfileContact,
  isUpdatingProfileContact: state.profileContacts.isUpdatingProfileContact
});

const mapDispatchToProps = (dispatch) => ({
  getProfileContact: (token) => dispatch(getProfileContactAsync(token)),
  updateProfileContact: (profileContact, token) => dispatch(updateProfileContactAsync(profileContact, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
