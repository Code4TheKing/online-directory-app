/** @format */

import { useEffect } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { SEARCH_ALL_KEYWORD } from '../pages/Directory';

export const useListAllContacts = (allContacts, getAccessTokenSilently, listAllContacts) => {
  useEffect(() => {
    if (!allContacts) {
      getAccessTokenSilently().then((token) => listAllContacts(token));
    }
  }, [allContacts, getAccessTokenSilently, listAllContacts]);
};

export const useListAllContactsNameChange = (
  contact,
  previousContact,
  fieldDefinitions,
  getAccessTokenSilently,
  listAllContacts
) => {
  useDeepCompareEffect(() => {
    if (
      contact &&
      previousContact &&
      contact[fieldDefinitions.idField.propName] === previousContact[fieldDefinitions.idField.propName] &&
      fieldDefinitions.mainFields.some(
        (mainField) => contact[mainField.propName] !== previousContact[mainField.propName]
      )
    ) {
      getAccessTokenSilently().then((token) => listAllContacts(token));
    }
  }, [contact, previousContact, fieldDefinitions, getAccessTokenSilently, listAllContacts]);
};

export const useUpdateSuggestInput = (contact, keyword, fieldDefinitions, setSuggestInput, renderAllText = false) => {
  useDeepCompareEffect(() => {
    if (contact) {
      setSuggestInput(
        fieldDefinitions.mainFields.reduce((acc, curr) => `${contact[curr.propName]}, ${contact[acc.propName]}`)
      );
    } else if (keyword && (renderAllText || keyword !== SEARCH_ALL_KEYWORD)) {
      setSuggestInput(keyword);
    } else {
      setSuggestInput('');
    }
  }, [contact, keyword, fieldDefinitions]);
};

export const useGetContactById = (contactId, getAccessTokenSilently, getContact, resetContact) => {
  useEffect(() => {
    if (contactId) {
      getAccessTokenSilently().then((token) => getContact(contactId, token));
    } else {
      resetContact();
    }
    return () => {
      resetContact();
    };
  }, [contactId, getAccessTokenSilently, getContact, resetContact]);
};

export const useSearchContacts = (keyword, getAccessTokenSilently, searchContacts, resetSearchContacts) => {
  useEffect(() => {
    if (keyword) {
      getAccessTokenSilently().then((token) => searchContacts(keyword, token));
    } else {
      resetSearchContacts();
    }
    return () => {
      resetSearchContacts();
    };
  }, [keyword, getAccessTokenSilently, searchContacts, resetSearchContacts]);
};
