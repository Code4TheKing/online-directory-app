/** @format */

import React, { Fragment } from 'react';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { connect } from 'react-redux';
import ContactCard from '../components/ContactCard';
import { inviteContactAsync, updateProfileContactAsync } from '../redux/actions';

const Profile = ({
  fieldDefinitions,
  profileContact,
  isGettingFieldDefinitions,
  isGettingProfileContact,
  isUpdatingProfileContact,
  isAdmin,
  updateProfileContact,
  inviteContact
}) => {
  return (
    <Fragment>
      <Row className='justify-content-center'>
        <h2>Profile</h2>
      </Row>
      <Row className='justify-content-center mt-3'>
        {isGettingFieldDefinitions || isGettingProfileContact ? (
          <Spinner animation='border' variant='primary' />
        ) : (
          profileContact && (
            <ContactCard
              width={'25rem'}
              fieldDefinitions={fieldDefinitions}
              editable={true}
              contact={profileContact}
              isSelf={true}
              isSaving={isUpdatingProfileContact}
              isAdmin={isAdmin}
              saveFunc={updateProfileContact}
              inviteFunc={inviteContact}
            />
          )
        )}
      </Row>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  fieldDefinitions: state.contacts.fieldDefinitions,
  profileContact: state.profileContacts.profileContact,
  isGettingFieldDefinitions: state.contacts.isGettingFieldDefinitions,
  isGettingProfileContact: state.profileContacts.isGettingProfileContact,
  isUpdatingProfileContact: state.profileContacts.isUpdatingProfileContact,
  isAdmin: state.profileContacts.isAdmin
});

const mapDispatchToProps = (dispatch) => ({
  updateProfileContact: (fieldDefinitions, profileContact, pictureFile, token) =>
    dispatch(updateProfileContactAsync(fieldDefinitions, profileContact, pictureFile, token)),
  inviteContact: (fieldDefinitions, contact, email, token) =>
    dispatch(inviteContactAsync(fieldDefinitions, contact, email, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
