import { CircularProgress } from '@material-ui/core';
import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import ContactCard from '../components/ContactCard';
import { getContactByIdAsync, saveContactAsync } from '../redux/actions';

const Profile = ({ profileContact, isGetting, isSaving, getContactById, saveContact }) => {
  useEffect(() => {
    getContactById(99);
  }, []);

  return (
    <Container>
      <Row className="justify-content-center">
        <h1>Profile</h1>
      </Row>
      <Row className="justify-content-center mt-3">
        {isGetting ?
          <CircularProgress /> :
          profileContact && <ContactCard editable={true} contact={profileContact} isSaving={isSaving} saveFunc={saveContact} width={'25rem'} />}
      </Row>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  profileContact: state.profileContact,
  isGetting: state.isGetting,
  isSaving: state.isSaving
});

const mapDispatchToProps = (dispatch) => ({
  getContactById: (id) => dispatch(getContactByIdAsync(id)),
  saveContact: (contact) => dispatch(saveContactAsync(contact))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
