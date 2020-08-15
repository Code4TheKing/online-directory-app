import { CircularProgress } from '@material-ui/core';
import React from 'react';
import CardColumns from 'react-bootstrap/CardColumns';
import '../styles/contact-card-list.scss';
import ContactCard from './ContactCard';

const ContactCardList = ({ searchText, contacts, isListing, saveFunc }) => {

  return (
    <div className="d-flex justify-content-center">
      {
        isListing ?
          <CircularProgress /> :
          contacts.length > 0 ?
            <CardColumns>
              {
                contacts.map(contact => <ContactCard key={contact._id} contact={contact} saveFunc={saveFunc} />)
              }
            </CardColumns> :
            searchText ?
              <p className="text-center text-info">No contacts found for the given search text</p> :
              <p className="text-center text-info">Use the search to display some contacts</p>
      }
    </div>
  );
}

export default ContactCardList;
