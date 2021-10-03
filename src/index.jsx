import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from "@auth0/auth0-react";
import * as serviceWorker from './serviceWorker';
import App from './App';

function url() {
  const r = window.location.origin + window.location.pathname;
  console.log('redirectUrl', r);
  return r;
}

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-uf87e942.eu.auth0.com"
      clientId="Mlm45jI7zvoQXbLSYSNV8F1qI1iTEnce"
      redirectUri={url()}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('app')
);

serviceWorker.unregister();
