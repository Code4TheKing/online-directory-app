import { useAuth0 } from '@auth0/auth0-react';
import { CircularProgress } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useHistory, useLocation } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';
import ContactCard from '../components/ContactCard';
import '../styles/edit-contact-auto-suggest.scss';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const ContactHandler = ({
  fieldDefinitions,
  contact,
  allContacts = [],
  editable,
  isGettingFieldDefinitions,
  isGettingContact,
  isUpdatingContact,
  isListingAllContacts,
  isProtected,
  isAdmin,
  getContact,
  updateContact,
  resetContact,
  listAllContacts
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const history = useHistory();
  const query = useQuery();
  const previousContact = usePrevious(contact);
  const [contactSuggestions, setContactSuggestions] = useState([]);
  const [autoSuggestInput, setAutoSuggestInput] = useState('');

  useDeepCompareEffect(() => {
    const contactId = query.get('id');
    if (contactId) {
      getAccessTokenSilently()
        .then(token => getContact(contactId, token))
    } else {
      resetContact();
    }
  }, [query, getAccessTokenSilently, getContact]);

  useDeepCompareEffect(() => {
    if (contact) {
      setAutoSuggestInput(contact[fieldDefinitions.mainField.propName]);
    } else {
      setAutoSuggestInput('');
    }
  }, [contact, fieldDefinitions]);

  useDeepCompareEffect(() => {
    if (!contact ||
      (contact && previousContact &&
        contact[fieldDefinitions.mainField.propName] !== previousContact[fieldDefinitions.mainField.propName])) {
      getAccessTokenSilently()
        .then(token => listAllContacts(token));
    }
  }, [contact, getAccessTokenSilently, listAllContacts]);

  const getContactSuggestions = (input) => {
    const sanitizedInput = input.trim().toLowerCase();

    setContactSuggestions(
      allContacts
        .sort((c1, c2) => (c1[fieldDefinitions.mainField.propName] > c2[fieldDefinitions.mainField.propName]) ? 1 : -1)
        .filter(contact => contact[fieldDefinitions.mainField.propName].toLowerCase().includes(sanitizedInput)));
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
    setAutoSuggestInput(suggestion[fieldDefinitions.mainField.propName]);
    loadContact(null, suggestion);
  }

  const renderSuggestion = (suggestion) => {
    return (
      <div>{suggestion[fieldDefinitions.mainField.propName]}</div>
    );
  }

  const loadContact = (event, suggestion) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (suggestion) {
      resetContact();
      history.push(`/edit-contact?id=${suggestion[fieldDefinitions.idField.propName]}`);
    }
  }

  if (isProtected && !isAdmin) {
    return (
      <h1 className="text-center text-danger">You are not authorized to view this page</h1>
    );
  }

  return (
    <>
      <Row className="justify-content-center">
        <Form onSubmit={loadContact}>
          <Autosuggest
            suggestions={contactSuggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            onSuggestionSelected={onSuggestionSelected}
            getSuggestionValue={getContactSuggestionValue}
            highlightFirstSuggestion={true}
            alwaysRenderSuggestions={true}
            renderSuggestion={renderSuggestion}
            inputProps={{
              placeholder: 'Type a name',
              value: autoSuggestInput,
              onChange
            }} />
        </Form>
      </Row>
      <Row className="justify-content-center mt-3">
        {isGettingFieldDefinitions || isGettingContact ?
          <CircularProgress /> :
          contact && <ContactCard
            fieldDefinitions={fieldDefinitions}
            editable={editable}
            contact={contact}
            isSaving={isUpdatingContact}
            saveFunc={updateContact}
            width={'25rem'} />
        }
      </Row>
    </>
  );
}

export default ContactHandler;
