import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import { listContactsBySearchAsync } from '../redux/actions';

const Search = ({ listContactsBySearch }) => {
  const [input, setInput] = useState('');

  const handleChange = (event) => {
    setInput(event.target.value);
  }

  const performSearch = (event) => {
    event.preventDefault();
    listContactsBySearch(input);
    setInput('');
  }

  return (
    <>
      <Form inline onSubmit={performSearch}>
        <Form.Control className="mr-2" type="text" placeholder="Search" size="lg" value={input} onChange={handleChange} />
        <Button type="submit" variant="outline-success">Search</Button>
      </Form>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({ listContactsBySearch: (searchText) => dispatch(listContactsBySearchAsync(searchText)) });

export default connect(null, mapDispatchToProps)(Search);
