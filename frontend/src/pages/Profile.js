import { CircularProgress } from '@material-ui/core';
import React from 'react';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import ContactCard from '../components/ContactCard';
import { updateProfileContactAsync } from '../redux/actions';

const Profile = ({
  fieldDefinitions,
  profileContact,
  isGettingFieldDefinitions,
  isGettingProfileContact,
  isUpdatingProfileContact,
  updateProfileContact
}) => {

  return (
    <>
      <Row className="justify-content-center">
        <h2>Profile</h2>
      </Row>
      <Row className="justify-content-center mt-3">
        {isGettingFieldDefinitions || isGettingProfileContact ?
          <CircularProgress /> :
          profileContact &&
          <ContactCard
            fieldDefinitions={fieldDefinitions}
            editable={true}
            contact={profileContact}
            isSaving={isUpdatingProfileContact}
            saveFunc={updateProfileContact}
            width={'25rem'} />}
      </Row>
    </>
  );
}

const mapStateToProps = (state) => ({
  fieldDefinitions: state.contacts.fieldDefinitions,
  profileContact: state.profileContacts.profileContact,
  isGettingFieldDefinitions: state.contacts.isGettingFieldDefinitions,
  isGettingProfileContact: state.profileContacts.isGettingProfileContact,
  isUpdatingProfileContact: state.profileContacts.isUpdatingProfileContact
});

const mapDispatchToProps = (dispatch) => ({
  updateProfileContact: (fieldDefinitions, profileContact, pictureFile, token) =>
    dispatch(updateProfileContactAsync(fieldDefinitions, profileContact, pictureFile, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
