import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const SearchBar = ({ searchFunc }) => {
  const [input, setInput] = useState('');

  const handleChange = (event) => {
    setInput(event.target.value);
  }

  const performSearch = (event) => {
    event.preventDefault();
    searchFunc(input);
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

export default SearchBar;
