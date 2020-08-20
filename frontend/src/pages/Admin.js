import { useAuth0 } from "@auth0/auth0-react";
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import ContactCard from '../components/ContactCard';
import useAdminCheck from "../hooks/UseAdminCheck";
import { addContactAsync } from '../redux/actions';

const Admin = ({ isAdding, addContact }) => {
  const { user } = useAuth0();
  const isAdmin = useAdminCheck(user);

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
        <ContactCard editable={true} isProcessing={isAdding} saveFunc={addContact} width={'25rem'} />
      </Row>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  isAdding: state.isAdding
});

const mapDispatchToProps = (dispatch) => ({
  addContact: (contact) => dispatch(addContactAsync(contact))
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
