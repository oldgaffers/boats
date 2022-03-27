import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from "@auth0/auth0-react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
// import * as serviceWorker from './serviceWorker';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CookiesProvider } from "react-cookie";
import red from '@mui/material/colors/red';
import OGAProvider from "./util/gql";
import BrowseApp from './browseapp';
import Boat from './components/boat';
import ProcessUpdates from './components/processupdates';
import Yearbook from './components/yearbook';
import MyFleets from './components/myfleets';
import SharedFleets from './components/sharedfleets';
import RBC60 from './components/rbc60';
import RBC60Entryies from './components/rbc60entries';

const theme = createTheme({
  palette: {
    secondary: red,
  },
});

const Pages = ({ app }) => {
  const auth = {
    domain: "dev-uf87e942.eu.auth0.com",
    clientId: "Mlm45jI7zvoQXbLSYSNV8F1qI1iTEnce",
    redirectUri: window.location.origin + window.location.pathname,
    audience: "https://oga.org.uk/boatregister",
  }
  const paypalOptions = {
    "client-id": 'AZg2v5veSxPSlZ-Zw2SVKJfls-cKCtIDxvFBpTQ3Bfz-jRXG_iIlO6fXnLIuXV158pWfcbgxgDhdH3wT',
    currency: "GBP",
    intent: "capture",
    // "data-client-token": "abc123xyz==",
  };

  switch (app) {
    case 'boat':
      return (
        <Auth0Provider
          domain="dev-uf87e942.eu.auth0.com"
          clientId="Mlm45jI7zvoQXbLSYSNV8F1qI1iTEnce"
          redirectUri={window.location.origin + window.location.pathname}
          audience="https://oga.org.uk/boatregister"
          scope="member"
        >
          <OGAProvider>
            <Boat location={window.location} />
          </OGAProvider>
        </Auth0Provider>
      );
    case 'my_fleets':
      return (
        <Auth0Provider
          domain="dev-uf87e942.eu.auth0.com"
          clientId="Mlm45jI7zvoQXbLSYSNV8F1qI1iTEnce"
          redirectUri={window.location.origin + window.location.pathname}
          audience="https://oga.org.uk/boatregister"
          scope="member"
        >
          <OGAProvider>
            <MyFleets location={window.location} />
          </OGAProvider>
        </Auth0Provider>
      );
    case 'shared_fleets':
      return (
        <Auth0Provider
          domain="dev-uf87e942.eu.auth0.com"
          clientId="Mlm45jI7zvoQXbLSYSNV8F1qI1iTEnce"
          redirectUri={window.location.origin + window.location.pathname}
          audience="https://oga.org.uk/boatregister"
          scope="member"
        >
          <OGAProvider>
            <SharedFleets location={window.location} />
          </OGAProvider>
        </Auth0Provider>
      );
    case 'pending':
      return (
        <Auth0Provider {...auth} scope="edit">
          <OGAProvider>
            <ProcessUpdates />
          </OGAProvider>
        </Auth0Provider>)
        ;
    case 'yearbook':
      return (
        <Auth0Provider {...auth} scope="edit">
          <OGAProvider>
            <Yearbook />
          </OGAProvider>
        </Auth0Provider>)
        ;
    case 'rbc60':
      return (
        <PayPalScriptProvider options={paypalOptions}>
          <Auth0Provider {...auth} scope="member">
            <OGAProvider>
              <RBC60 />
            </OGAProvider>
          </Auth0Provider>
        </PayPalScriptProvider>
        )
        ;
    case 'rbc60_entries':
      return (
        <PayPalScriptProvider options={paypalOptions}>
          <Auth0Provider {...auth} scope="edit">
            <OGAProvider>
              <RBC60Entryies />
            </OGAProvider>
          </Auth0Provider>
        </PayPalScriptProvider>
        )
        ;
    default:
      console.log('browse', app);
      return (
        <Auth0Provider
          domain="dev-uf87e942.eu.auth0.com"
          clientId="Mlm45jI7zvoQXbLSYSNV8F1qI1iTEnce"
          redirectUri={window.location.origin + window.location.pathname}
          audience="https://oga.org.uk/boatregister"
          scope="member"
        >
          <OGAProvider>
            <BrowseApp view={app} />
          </OGAProvider>
        </Auth0Provider>
      );
  }
};

const tags = [
  'app', 'boat', 'sell', 'small', 'pending', 'yearbook', 'my_fleets', 'shared_fleets', 'rbc60', 'rbc60_entries'
];
const div = tags.filter((id) => document.getElementById(id));
if (div.length > 0) {
  const app = div[0];
  ReactDOM.render(
    <React.StrictMode>
      <CookiesProvider>
        <ThemeProvider theme={theme}>
          <Pages app={app} />
        </ThemeProvider>
      </CookiesProvider>
    </React.StrictMode>,
    document.getElementById(app)
  );
} else {
  ReactDOM.render(
    <React.StrictMode>
      no element found with an ID to tell us what to render.
      One of {tags.join(', ')} expected.
    </React.StrictMode>,
    document.getElementsByTagName('body')[0]
  );
}

// serviceWorker.unregister();
