import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { resetContact } from '../redux/actionCreators';

const SearchBar = ({ searchText, searchFunc, resetSearch, redirectOnSearch }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [input, setInput] = useState(searchText);

  useEffect(() => {
    if (searchText) {
      getAccessTokenSilently()
        .then(token => searchFunc(searchText, token));
    } else {
      resetSearch();
    }
    return function cleanup() {
      resetContact();
    }
  }, [searchText, getAccessTokenSilently, searchFunc, resetSearch]);

  const handleChange = (event) => {
    setInput(event.target.value);
  }

  const performSearch = (event) => {
    event.preventDefault();
    redirectOnSearch(input);
  }

  return (
    <Form className="justify-content-center" onSubmit={performSearch} inline>
      <Form.Control
        className="mx-2 mt-2"
        type="text"
        placeholder="Search"
        value={input}
        onChange={handleChange} />
      {input.trim().length > 0 ?
        <Button className="mt-2" type="submit" variant="success">Search</Button> :
        <Button className="mt-2" type="submit" variant="outline-success" disabled>Search</Button>}
    </Form>
  );
};

export default SearchBar;
