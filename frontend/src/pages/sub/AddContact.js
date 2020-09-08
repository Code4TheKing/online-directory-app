import { CircularProgress } from '@material-ui/core';
import React from 'react';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ContactCard from '../../components/ContactCard';
import { SEARCH_BY_NAME_PATH } from '../../OnlineDirectoryApp';
import { addContactAsync } from '../../redux/actions';

const AddContact = ({ fieldDefinitions, isGettingFieldDefinitions, isAddingContact, isAdmin, addContact }) => {
  const history = useHistory();

  if (!isAdmin) {
    return (
      <>
        <h1 className="text-center text-danger">You are not authorized to view this page</h1>
      </>
    );
  }

  return (
    <>
      <Row className="justify-content-center">
        <h2>Add Contact</h2>
      </Row>
      <Row className="justify-content-center mt-3">
        {isGettingFieldDefinitions ?
          <CircularProgress /> :
          <ContactCard
            fieldDefinitions={fieldDefinitions}
            editable={true}
            isSaving={isAddingContact}
            saveFunc={addContact}
            redirectAfterSave={(savedContact) => history.push(`${SEARCH_BY_NAME_PATH}?id=${savedContact[fieldDefinitions.idField.propName]}`)}
            width={'25rem'} />}
      </Row>
    </>
  );
}

const mapStateToProps = (state) => ({
  fieldDefinitions: state.contacts.fieldDefinitions,
  isGettingFieldDefinitions: state.contacts.isGettingFieldDefinitions,
  isAddingContact: state.contacts.isAddingContact,
  isAdmin: state.profileContacts.isAdmin
});

const mapDispatchToProps = (dispatch) => ({
  addContact: (fieldDefinitions, contact, pictureFile, token) => dispatch(addContactAsync(fieldDefinitions, contact, pictureFile, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddContact);
