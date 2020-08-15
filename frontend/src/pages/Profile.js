import { CircularProgress } from '@material-ui/core';
import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import ContactCard from '../components/ContactCard';
import { getContactByIdAsync, saveContactAsync } from '../redux/actions';

const Profile = ({ profileContact, isGetting, isUpdating, getContactById, saveContact }) => {
  useEffect(() => {
    getContactById('13aefc61-16c8-4cc5-a677-f0b8f9fb9d98');
  }, [getContactById]);

  return (
    <Container>
      <Row className="justify-content-center">
        <h1>Profile</h1>
      </Row>
      <Row className="justify-content-center mt-3">
        {isGetting ?
          <CircularProgress /> :
          profileContact && <ContactCard editable={true} contact={profileContact} isUpdating={isUpdating} saveFunc={saveContact} width={'25rem'} />}
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
  getContactById: (id) => dispatch(getContactByIdAsync(id)),
  saveContact: (contact) => dispatch(saveContactAsync(contact))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
