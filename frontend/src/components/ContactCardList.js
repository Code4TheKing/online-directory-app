import React from 'react';
import CardColumns from 'react-bootstrap/CardColumns';
import Container from 'react-bootstrap/Container';
import { connect } from 'react-redux';
import ContactCard from './ContactCard';

const ContactCardList = ({ contacts, isFetchingList }) => {

  return (
    <>
      <Container>
        {
          isFetchingList ?
            <p className="text-center text-info">Loading...</p> :
            contacts && contacts.length > 0 ?
              <CardColumns>
                {
                  contacts.map(contact => <ContactCard key={contact.id} contact={contact} />)
                }
              </CardColumns> :
              <p className="text-center text-info">Use the search to display some contacts</p>
        }
      </Container>
    </>
  );
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(ContactCardList);
