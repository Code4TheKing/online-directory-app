import { useAuth0 } from '@auth0/auth0-react';
import { CircularProgress } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import useDeepCompareEffect from 'use-deep-compare-effect';
import ContactCard from '../components/ContactCard';
import usePrevious from '../hooks/usePrevious';
import '../styles/auto-suggest.scss';

const ContactHandler = ({
  contactId,
  fieldDefinitions,
  contact,
  allContacts = [],
  editable,
  isGettingFieldDefinitions,
  isGettingContact,
  isUpdatingContact,
  isListingAllContacts,
  isInvitingContact,
  isProtected,
  isAdmin,
  redirectPath,
  getContact,
  updateContact,
  inviteContact,
  resetContact,
  listAllContacts
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const previousContact = usePrevious(contact);
  const [contactSuggestions, setContactSuggestions] = useState([]);
  const [autoSuggestInput, setAutoSuggestInput] = useState('');

  useEffect(() => {
    if (contactId) {
      getAccessTokenSilently()
        .then(token => getContact(contactId, token))
    } else {
      resetContact();
    }
  }, [contactId, getAccessTokenSilently, getContact, resetContact]);

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
      redirectPath(suggestion[fieldDefinitions.idField.propName]);
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
            isAdmin={isAdmin}
            isSaving={isUpdatingContact}
            isInviting={isInvitingContact}
            saveFunc={updateContact}
            inviteFunc={inviteContact}
            width={'25rem'} />
        }
      </Row>
    </>
  );
}

export default ContactHandler;
