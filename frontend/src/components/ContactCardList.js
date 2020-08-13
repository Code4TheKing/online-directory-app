import React from 'react';
import CardColumns from 'react-bootstrap/CardColumns';
import Container from 'react-bootstrap/Container';
import ContactCard from './ContactCard';

const ContactCardList = ({ contacts, isListing, saveFunc }) => {

  return (
    <>
      <Container>
        {
          isListing ?
            <p className="text-center text-info">Loading...</p> :
            contacts ?
              (contacts.length > 0 ?
                <CardColumns>
                  {
                    contacts.map(contact => <ContactCard key={contact.id} contact={contact} saveFunc={saveFunc} />)
                  }
                </CardColumns> :
                <p className="text-center text-info">No contacts found for the given search text</p>) :
              <p className="text-center text-info">Use the search to display some contacts</p>
        }
      </Container>
    </>
  );
}

export default ContactCardList;
