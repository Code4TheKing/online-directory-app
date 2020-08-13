import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import ContactCardList from '../components/ContactCardList';
import SearchBar from '../components/SearchBar';
import { listContactsBySearchAsync, saveContactAsync } from '../redux/actions';

const Home = ({ contacts, isListing, listContactsBySearch, saveContact }) => {

  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <SearchBar searchFunc={listContactsBySearch} />
        </Row>
        <Row className="justify-content-center mt-5">
          <ContactCardList contacts={contacts} isListing={isListing} saveFunc={saveContact} />
        </Row>
      </Container>
    </>
  )
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => ({
  listContactsBySearch: (searchText) => dispatch(listContactsBySearchAsync(searchText)),
  saveContact: (contact) => dispatch(saveContactAsync(contact))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
