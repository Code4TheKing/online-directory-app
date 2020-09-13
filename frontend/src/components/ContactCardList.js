import React, { Fragment } from 'react';
import CardColumns from 'react-bootstrap/CardColumns';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { SEARCH_ALL_KEYWORD } from '../pages/Directory';
import '../styles/contact-card-list.scss';
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

  return (
    <>
      {
        isGettingFieldDefinitions || isListing ?
          <Row className="justify-content-center mt-3">
            <Spinner animation="border" variant="primary" />
          </Row> :
          contacts && contacts.length > 0 ?
            <Fragment>
              <Row className="mt-3">
                <h2 className="flex-grow-1">
                  {searchText !== SEARCH_ALL_KEYWORD ?
                    <span>Results for <span className="text-primary">{searchText}</span></span> :
                    <span></span>}
                </h2>
                <PageRefresher />
              </Row>
              <Row>
                <CardColumns className="flex-fill px-3 pt-3 mb-3" style={{ backgroundColor: '#eef1f5' }}>
                  {contacts.map(contact =>
                    <ContactCard
                      fieldDefinitions={fieldDefinitions}
                      key={contact[fieldDefinitions.idField.propName]}
                      contact={contact}
                      isInviting={isInviting}
                      isAdmin={isAdmin}
                      saveFunc={saveFunc}
                      inviteFunc={inviteFunc} />)}
                </CardColumns>
              </Row>
            </Fragment> :
            searchText ?
              <p className="text-center text-info my-2">No contacts found for the given keyword</p> :
              <p className="text-center text-info my-2">Use the search to display some contacts</p>
      }
    </>
  );
}

export default ContactCardList;
