import { useAuth0 } from '@auth0/auth0-react';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const SearchBar = ({ searchText, searchFunc }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [input, setInput] = useState(searchText);

  const handleChange = (event) => {
    setInput(event.target.value);
  }

  const performSearch = (event) => {
    event.preventDefault();
    getAccessTokenSilently()
      .then(token => searchFunc(input, token));
  }

  return (
    <Form className="justify-content-center" inline onSubmit={performSearch}>
      <Form.Control
        className="mx-2"
        type="text"
        placeholder="Search (:all: for everything)"
        size="lg"
        value={input}
        onChange={handleChange} />
      {input.trim().length > 0 ?
        <Button type="submit" variant="success">Search</Button> :
        <Button type="submit" variant="outline-success" disabled>Search</Button>}
    </Form>
  );
};

export default SearchBar;
