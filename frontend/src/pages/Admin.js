import { CircularProgress } from '@material-ui/core';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import ContactCard from '../components/ContactCard';
import { addContactAsync } from '../redux/actions';

const Admin = ({ fieldDefinitions, isGettingFieldDefinitions, isAddingContact, isAdmin, addContact }) => {

  if (!isAdmin) {
    return (
      <Container>
        <h1 className="text-center text-danger">You are not authorized to view this page</h1>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <h1>Admin</h1>
      </Row>
      <Row className="justify-content-center mt-3">
        <h2>Add Contact</h2>
      </Row>
      <Row className="justify-content-center mt-3">
        {isGettingFieldDefinitions ?
          <CircularProgress /> :
          <ContactCard fieldDefinitions={fieldDefinitions} editable={true} isSaving={isAddingContact} saveFunc={addContact} width={'25rem'} />}
      </Row>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  fieldDefinitions: state.contacts.fieldDefinitions,
  isGettingFieldDefinitions: state.contacts.isGettingFieldDefinitions,
  isAddingContact: state.contacts.isAddingContact,
  isAdmin: state.profileContacts.isAdmin
});

const mapDispatchToProps = (dispatch) => ({
  addContact: (contact, token) => dispatch(addContactAsync(contact, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
