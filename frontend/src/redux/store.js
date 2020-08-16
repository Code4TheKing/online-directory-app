import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import contactsReducer from "./reducers/contactsReducer";

export default createStore(contactsReducer, composeWithDevTools(applyMiddleware(thunk)));
