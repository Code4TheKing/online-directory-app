/** @format */

import React, { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
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

  const loadSuggestions = (input) => {
    const sanitizedInput = input.trim().toLowerCase();

    if (allContacts) {
      setContactSuggestions(
        allContacts.filter(
          (contact) =>
            fieldDefinitions.mainFields.some((mainField) =>
              contact[mainField.propName]?.toLowerCase().includes(sanitizedInput)
            ) ||
            fieldDefinitions.otherFields.some((otherField) => {
              switch (otherField.type) {
                case 'ObjectList':
                  return contact[otherField.propName]?.some((objectListItem) =>
                    Object.values(objectListItem).some((itemValue) => itemValue?.toLowerCase().includes(sanitizedInput))
                  );
                case 'StringList':
                  return contact[otherField.propName]?.some((stringListItem) =>
                    stringListItem?.toLowerCase().includes(sanitizedInput)
                  );
                default:
                  return contact[otherField.propName]?.toLowerCase().includes(sanitizedInput);
              }
            })
        )
      );
    }
  };

  const getContactSuggestionValue = (suggestion) =>
    fieldDefinitions.mainFields.reduce((acc, curr) => `${suggestion[curr.propName]}, ${suggestion[acc.propName]}`);

  const onChange = (event, { newValue }) => {
    setAutoSuggestInput(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    loadSuggestions(value);
  };

  const onSuggestionsClearRequested = () => {
    setContactSuggestions([]);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    suggestionRedirect(suggestion[fieldDefinitions.idField.propName]);
  };

  const renderSuggestion = (suggestion) => {
    return (
      <div>
        {fieldDefinitions.mainFields.reduce((acc, curr) => `${suggestion[curr.propName]}, ${suggestion[acc.propName]}`)}
      </div>
    );
  };

  const renderInputComponent = (inputProps) => {
    if (isListingAllContacts) {
      return <input {...inputProps} disabled />;
    }
    return <input {...inputProps} />;
  };

  const handleSearch = (event) => {
    event.preventDefault();
    event.stopPropagation();
    searchRedirect(autoSuggestInput);
  };

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
        renderInputComponent={renderInputComponent}
        inputProps={{
          placeholder: 'Type a keyword',
          value: autoSuggestInput,
          onChange,
          type: 'search'
        }}
      />
      <Button
        className='ml-2'
        style={{ width: '5rem' }}
        type='submit'
        variant={autoSuggestInput.trim().length === 0 ? 'outline-success' : 'success'}
        disabled={autoSuggestInput.trim().length === 0}>
        {isListingAllContacts ? <Spinner as='span' animation='border' variant='primary' size='sm' /> : 'Search'}
      </Button>
    </Form>
  );
};

export default AutoSuggester;
