import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Auth0ProviderWithHistory from './components/Auth0ProviderWithHistory';
import OnlineDirectoryApp from './OnlineDirectoryApp';
import store from './redux/store';
import * as serviceWorker from './serviceWorker';
import './styles/index.css';

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <Auth0ProviderWithHistory>
          <OnlineDirectoryApp />
        </Auth0ProviderWithHistory>
      </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
