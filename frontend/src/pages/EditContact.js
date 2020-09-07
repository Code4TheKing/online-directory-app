import React from 'react';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ContactHandler from '../components/ContactHandler';
import useQuery from '../hooks/useQuery';
import { EDIT_CONTACT_PATH } from '../OnlineDirectoryApp';
import { resetContact } from '../redux/actionCreators';
import { getContactAsync, listAllContactsAsync, updateContactAsync } from '../redux/actions';

const EditContact = ({
  fieldDefinitions,
  contact,
  allContacts = [],
  isGettingFieldDefinitions,
  isGettingContact,
  isUpdatingContact,
  isListingAllContacts,
  isAdmin,
  getContact,
  updateContact,
  resetContact,
  listAllContacts
}) => {
  const query = useQuery();
  const history = useHistory();

  return (
    <>
      <Row className="justify-content-center mb-3">
        <h2>Edit Contact</h2>
      </Row>
      <ContactHandler
        contactId={query.get('id')}
        fieldDefinitions={fieldDefinitions}
        contact={contact}
        allContacts={allContacts}
        editable={true}
        isGettingFieldDefinitions={isGettingFieldDefinitions}
        isGettingContact={isGettingContact}
        isUpdatingContact={isUpdatingContact}
        isProtected={true}
        isAdmin={isAdmin}
        redirectPath={(contactId) => history.push(`${EDIT_CONTACT_PATH}?id=${contactId}`)}
        getContact={getContact}
        updateContact={updateContact}
        resetContact={resetContact}
        listAllContacts={listAllContacts} />
    </>
  );
}

const mapStateToProps = (state) => ({
  fieldDefinitions: state.contacts.fieldDefinitions,
  contact: state.contacts.contact,
  allContacts: state.contacts.allContacts,
  isGettingFieldDefinitions: state.contacts.isGettingFieldDefinitions,
  isGettingContact: state.contacts.isGettingContact,
  isUpdatingContact: state.contacts.isUpdatingContact,
  isListingAllContacts: state.contacts.isListingAllContacts,
  isAdmin: state.profileContacts.isAdmin
});

const mapDispatchToProps = (dispatch) => ({
  getContact: (contactId, token) => dispatch(getContactAsync(contactId, token)),
  updateContact: (fieldDefinitions, contact, pictureFile, token) =>
    dispatch(updateContactAsync(fieldDefinitions, contact, pictureFile, token)),
  resetContact: () => dispatch(resetContact()),
  listAllContacts: (token) => dispatch(listAllContactsAsync(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditContact);
