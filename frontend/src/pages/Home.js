import React from 'react';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import ContactCardList from '../components/ContactCardList';
import SearchBar from '../components/SearchBar';
import { listContactsByKeywordAsync, saveContactAsync } from '../redux/actions';

const Home = ({ searchText, contacts, isListing, listContactsByKeyword, saveContact }) => {

  return (
    <div className="mx-5">
      <Row className="justify-content-center">
        <SearchBar searchFunc={listContactsByKeyword} />
      </Row>
      <Row className="justify-content-center mt-5">
        <ContactCardList searchText={searchText} contacts={contacts} isListing={isListing} saveFunc={saveContact} />
      </Row>
    </div>
  )
}

const mapStateToProps = (state) => ({
  searchText: state.searchText,
  contacts: state.contacts,
  isListing: state.isListing
});

const mapDispatchToProps = (dispatch) => ({
  listContactsByKeyword: (searchText) => dispatch(listContactsByKeywordAsync(searchText)),
  saveContact: (contact) => dispatch(saveContactAsync(contact))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
