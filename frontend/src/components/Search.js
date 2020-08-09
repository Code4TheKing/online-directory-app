import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import { fetchContactsBySearch } from '../redux/actions';

const Search = ({ fetchContactsBySearch }) => {
  const [input, setInput] = useState('');

  const handleChange = (event) => {
    setInput(event.target.value);
  }

  const performSearch = (event) => {
    event.preventDefault();
    fetchContactsBySearch(input);
    setInput('');
  }

  return (
    <>
      <Form className="justify-content-center" inline onSubmit={performSearch}>
        <Form.Control className="mr-md-2 w-25" type="text" placeholder="Search" size="lg" value={input} onChange={handleChange} />
        <Button type="submit" variant="outline-success">Search</Button>
      </Form>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({ fetchContactsBySearch: (searchText) => dispatch(fetchContactsBySearch(searchText)) });

export default connect(null, mapDispatchToProps)(Search);
