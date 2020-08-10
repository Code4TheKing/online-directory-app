import React from 'react';
import CardColumns from 'react-bootstrap/CardColumns';
import Container from 'react-bootstrap/Container';
import { connect } from 'react-redux';
import ContactCard from './ContactCard';

const ContactCardList = ({ contacts, isFetching }) => {

  return (
    <>
      <Container>
        <div className="mt-5">
          {
            isFetching ?
              <p className="text-center text-info">Loading...</p> :
              contacts && contacts.length > 0 ?
                <CardColumns>
                  {
                    contacts.map(contact => <ContactCard contact={contact} />)
                  }
                </CardColumns> :
                <p className="text-center text-info">Use the search to display some contacts</p>
          }
        </div>
      </Container>
    </>
  );
}

const mapStateToProps = (state) => state.listContacts;

export default connect(mapStateToProps)(ContactCardList);
