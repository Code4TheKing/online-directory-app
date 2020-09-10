import React, { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../styles/auto-suggest.scss';

const AutoSuggester = ({
  input,
  fieldDefinitions,
  allContacts = [],
  isListingAllContacts,
  suggestionRedirect,
  searchRedirect
}) => {
  const [contactSuggestions, setContactSuggestions] = useState([]);
  const [autoSuggestInput, setAutoSuggestInput] = useState(input);

  useEffect(() => {
    setAutoSuggestInput(input);
  }, [input]);

  const getContactSuggestions = (input) => {
    const sanitizedInput = input.trim().toLowerCase();

    setContactSuggestions(
      allContacts
        .filter(contact => contact[fieldDefinitions.mainField.propName].toLowerCase().includes(sanitizedInput)
          || fieldDefinitions.otherFields.some(otherField => contact[otherField.propName]?.toLowerCase().includes(sanitizedInput)))
        .sort((c1, c2) => (c1[fieldDefinitions.mainField.propName] > c2[fieldDefinitions.mainField.propName]) ? 1 : -1));
  }

  const getContactSuggestionValue = (suggestion) => suggestion[fieldDefinitions.mainField.propName];

  const onChange = (event, { newValue }) => {
    setAutoSuggestInput(newValue);
  }

  const onSuggestionsFetchRequested = ({ value }) => {
    getContactSuggestions(value);
  }

  const onSuggestionsClearRequested = () => {
    setContactSuggestions([]);
  }

  const onSuggestionSelected = (event, { suggestion }) => {
    suggestionRedirect(suggestion[fieldDefinitions.idField.propName]);
  }

  const renderSuggestion = (suggestion) => {
    return (
      <div>{suggestion[fieldDefinitions.mainField.propName]}</div>
    );
  }

  const handleSearch = (event) => {
    event.preventDefault();
    event.stopPropagation();
    searchRedirect(autoSuggestInput);
  }

  return (
    <Form onSubmit={handleSearch} inline>
      <Autosuggest
        suggestions={contactSuggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={getContactSuggestionValue}
        alwaysRenderSuggestions={true}
        renderSuggestion={renderSuggestion}
        inputProps={{
          placeholder: 'Type a name',
          value: autoSuggestInput,
          onChange
        }} />
      {autoSuggestInput.trim().length > 0 ?
        <Button className="ml-2" type="submit" variant="success">Search</Button> :
        <Button className="ml-2" type="submit" variant="outline-success" disabled>Search</Button>}
    </Form>
  );
}

export default AutoSuggester;
