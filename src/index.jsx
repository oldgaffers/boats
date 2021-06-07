import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from "@auth0/auth0-react";
import * as serviceWorker from './serviceWorker';
import App from './App';

const L = () => {
  console.log('location for oath redirect', window.location.href);
  return '';
};

ReactDOM.render(
  <React.StrictMode>
    <L/>
    <Auth0Provider
      domain="dev-uf87e942.eu.auth0.com"
      clientId="Mlm45jI7zvoQXbLSYSNV8F1qI1iTEnce"
      redirectUri={window.location.href}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('app')
);

serviceWorker.unregister();
