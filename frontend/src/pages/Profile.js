import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import ContactCard from '../components/ContactCard';
import { getContactByIdAsync } from '../redux/actions';

const Profile = ({ profileContact, contacts, isGetting, getContactById }) => {
  useEffect(() => {
    getContactById(99, contacts);
  });

  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <h1>Profile</h1>
        </Row>
        <Row className="justify-content-center">
          {isGetting ?
            <p className="text-center text-info">Loading...</p> :
            profileContact && <ContactCard editable={true} contact={profileContact} width={'20rem'} />}
        </Row>
      </Container>
    </>
  );
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => ({ getContactById: (id, contacts) => dispatch(getContactByIdAsync(id, contacts)) });

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
