/** @format */

import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import contactsReducer from './reducers/contactsReducer';
import profileContactsReducer from './reducers/profileContactsReducer';

export default createStore(
  combineReducers({ contacts: contactsReducer, profileContacts: profileContactsReducer }),
  composeWithDevTools(applyMiddleware(thunk))
);
