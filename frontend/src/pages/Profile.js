import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress } from '@material-ui/core';
import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import ContactCard from '../components/ContactCard';
import { getContactByIdAsync, saveContactAsync } from '../redux/actions';

const Profile = ({ profileContact, isGetting, isUpdating, getContactById, saveContact }) => {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently()
      .then(token => getContactById('default', token));
  }, [getContactById]);

  return (
    <Container>
      <Row className="justify-content-center">
        <h1>Profile</h1>
      </Row>
      <Row className="justify-content-center mt-3">
        {isGetting ?
          <CircularProgress /> :
          profileContact && <ContactCard editable={true} contact={profileContact} isProcessing={isUpdating} saveFunc={saveContact} width={'25rem'} />}
      </Row>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  profileContact: state.profileContact,
  isGetting: state.isGetting,
  isUpdating: state.isUpdating
});

const mapDispatchToProps = (dispatch) => ({
  getContactById: (id, token) => dispatch(getContactByIdAsync(id, token)),
  saveContact: (contact, token) => dispatch(saveContactAsync(contact, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
