/** @format */

import React, { Fragment } from 'react';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { connect } from 'react-redux';
import ContactCard from '../components/ContactCard';
import { inviteContactAsync, listUsersForContactAsync, updateProfileContactAsync } from '../redux/actions';

const Profile = ({
  fieldDefinitions,
  linkedUsers,
  profileContact,
  isGettingFieldDefinitions,
  isGettingProfileContact,
  isUpdatingProfileContact,
  isListingLinkedUsers,
  isAdmin,
  updateProfileContact,
  inviteContact,
  listLinkedUsers
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
              linkedUsers={linkedUsers}
              isSelf={true}
              isSaving={isUpdatingProfileContact}
              isListingLinkedUsers={isListingLinkedUsers}
              isAdmin={isAdmin}
              saveFunc={updateProfileContact}
              inviteFunc={inviteContact}
              listLinkedUsersFunc={listLinkedUsers}
            />
          )
        )}
      </Row>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  fieldDefinitions: state.contacts.fieldDefinitions,
  linkedUsers: state.contacts.linkedUsers,
  profileContact: state.profileContacts.profileContact,
  isGettingFieldDefinitions: state.contacts.isGettingFieldDefinitions,
  isGettingProfileContact: state.profileContacts.isGettingProfileContact,
  isUpdatingProfileContact: state.profileContacts.isUpdatingProfileContact,
  isListingLinkedUsers: state.contacts.isListingUsersForContact,
  isAdmin: state.profileContacts.isAdmin
});

const mapDispatchToProps = (dispatch) => ({
  updateProfileContact: (fieldDefinitions, profileContact, pictureFile, token) =>
    dispatch(updateProfileContactAsync(fieldDefinitions, profileContact, pictureFile, token)),
  inviteContact: (fieldDefinitions, contact, email, token) =>
    dispatch(inviteContactAsync(fieldDefinitions, contact, email, token)),
  listLinkedUsers: (contactId, token) => dispatch(listUsersForContactAsync(contactId, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
