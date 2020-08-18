import { CircularProgress } from '@material-ui/core';
import React from 'react';
import CardColumns from 'react-bootstrap/CardColumns';
import Container from 'react-bootstrap/Container';
import '../styles/contact-card-list.scss';
import ContactCard from './ContactCard';

const ContactCardList = ({ searchText, contacts, isListing, saveFunc }) => {

  return (
    <Container className="d-flex justify-content-center border">
      {
        isListing ?
          <CircularProgress /> :
          contacts.length > 0 ?
            <CardColumns className="mt-2">
              {
                contacts.map(contact => <ContactCard key={contact._id} contact={contact} saveFunc={saveFunc} />)
              }
            </CardColumns> :
            searchText ?
              <p className="text-center text-info my-2">No contacts found for the given search text</p> :
              <p className="text-center text-info my-2">Use the search to display some contacts</p>
      }
    </Container>
  );
}

export default ContactCardList;
