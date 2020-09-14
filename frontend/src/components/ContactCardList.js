import React, { Fragment } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { SEARCH_ALL_KEYWORD } from '../pages/Directory';
import ContactCard from './ContactCard';
import PageRefresher from './PageRefresher';

const ContactCardList = ({
  fieldDefinitions,
  searchText,
  contacts,
  isGettingFieldDefinitions,
  isListing,
  isInviting,
  isAdmin = false,
  saveFunc,
  inviteFunc
}) => {

  if (isGettingFieldDefinitions || isListing) {
    return (
      <Row className="justify-content-center mt-3">
        <Spinner animation="border" variant="primary" />
      </Row>
    );
  }

  if (contacts && contacts.length > 0) {
    return (
      <Fragment>
        <Row className="mt-3 mx-3">
          <h2 className="flex-grow-1">
            {searchText !== SEARCH_ALL_KEYWORD ?
              <span>Results for <span className="text-primary">{searchText}</span></span> :
              <span></span>}
          </h2>
          <PageRefresher />
        </Row>
        <Row className="mx-3 px-2 pt-4" style={{ backgroundColor: '#eef1f5' }}>
          {contacts.map(contact =>
            <Col className="mb-4 px-2">
              <ContactCard
                width='20rem'
                fieldDefinitions={fieldDefinitions}
                key={contact[fieldDefinitions.idField.propName]}
                contact={contact}
                isInviting={isInviting}
                isAdmin={isAdmin}
                saveFunc={saveFunc}
                inviteFunc={inviteFunc} />
            </Col>)}
        </Row>
      </Fragment>
    );
  }

  if (searchText) {
    return (<p className="text-center text-info my-2">No contacts found for the given keyword</p>);
  }

  return (<p className="text-center text-info my-2">Use the search to display some contacts</p>);
}

export default ContactCardList;
