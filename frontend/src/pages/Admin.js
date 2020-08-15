import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import ContactCard from '../components/ContactCard';
import { addContactAsync } from '../redux/actions';

const Admin = ({ isAdding, addContact }) => (
  <Container>
    <Row className="justify-content-center">
      <h1>Admin</h1>
    </Row>
    <Row className="justify-content-center mt-3">
      <h2>Add Contact</h2>
    </Row>
    <Row className="justify-content-center mt-3">
      <ContactCard editable={true} isUpdating={isAdding} saveFunc={addContact} width={'25rem'} />
    </Row>
  </Container>
);

const mapStateToProps = (state) => ({
  isAdding: state.isAdding
});

const mapDispatchToProps = (dispatch) => ({
  addContact: (contact) => dispatch(addContactAsync(contact))
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
