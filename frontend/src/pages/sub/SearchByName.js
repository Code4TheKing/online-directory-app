import React from 'react';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ContactHandler from '../../components/ContactHandler';
import useQuery from '../../hooks/useQuery';
import { SEARCH_BY_NAME_PATH, SEARCH_PATH } from '../../OnlineDirectoryApp';
import { resetContact } from '../../redux/actionCreators';
import { getContactAsync, listAllContactsAsync, updateContactAsync } from '../../redux/actions';

const SearchByName = ({
  fieldDefinitions,
  contact,
  allContacts = [],
  isGettingFieldDefinitions,
  isGettingContact,
  isUpdatingContact,
  isListingAllContacts,
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
        <h2>Search By Name</h2>
      </Row>
      <ContactHandler
        contactId={query.get('id')}
        fieldDefinitions={fieldDefinitions}
        contact={contact}
        allContacts={allContacts}
        editable={false}
        isGettingFieldDefinitions={isGettingFieldDefinitions}
        isGettingContact={isGettingContact}
        isUpdatingContact={isUpdatingContact}
        isProtected={false}
        redirectPath={(contactId) => history.push(`${SEARCH_PATH}${SEARCH_BY_NAME_PATH}?id=${contactId}`)}
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
  isListingAllContacts: state.contacts.isListingAllContacts
});

const mapDispatchToProps = (dispatch) => ({
  getContact: (contactId, token) => dispatch(getContactAsync(contactId, token)),
  updateContact: (fieldDefinitions, contact, pictureFile, token) =>
    dispatch(updateContactAsync(fieldDefinitions, contact, pictureFile, token)),
  resetContact: () => dispatch(resetContact()),
  listAllContacts: (token) => dispatch(listAllContactsAsync(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchByName);
