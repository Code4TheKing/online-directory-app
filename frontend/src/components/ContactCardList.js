import React from 'react';
import CardColumns from 'react-bootstrap/CardColumns';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import '../styles/contact-card-list.scss';
import ContactCard from './ContactCard';
import { SEARCH_ALL_KEYWORD } from '../pages/Search';

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

  return (
    <>
      {
        isGettingFieldDefinitions || isListing ?
          <Spinner animation="border" variant="primary" /> :
          contacts && contacts.length > 0 ?
            <Row>
              <h2 className="align-self-start mt-3">
                {searchText !== SEARCH_ALL_KEYWORD ?
                  <span>Results for <span className="text-primary">{searchText}</span></span> :
                  <span></span>}
              </h2>
              <CardColumns className="px-3 pt-3 mb-3" style={{ backgroundColor: '#eef1f5' }}>
                {contacts.map(contact =>
                  <ContactCard
                    fieldDefinitions={fieldDefinitions}
                    key={contact._id}
                    contact={contact}
                    isInviting={isInviting}
                    isAdmin={isAdmin}
                    saveFunc={saveFunc}
                    inviteFunc={inviteFunc} />)}
              </CardColumns>
            </Row> :
            searchText ?
              <p className="text-center text-info my-2">No contacts found for the given search text</p> :
              <p className="text-center text-info my-2">Use the search to display some contacts</p>
      }
    </>
  );
}

export default ContactCardList;
