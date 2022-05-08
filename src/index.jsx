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
import RBC60CrewForm from './components/rbc60crewform';
import OGA60Interest from './components/oga60interest';
import LoginButton from './components/loginbutton';

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
    useRefreshTokens: true,
    cacheLocation: 'localstorage',
  }
  // console.log('paypal', window.location);
  const paypalOptions = {
    "client-id": 'Ab7dxlH_fK99yWWn7Z2V9WdaSiX1H26jJLtfIQ4sOcgFtqYklvaxTLZgXCSwOb2scdRGIRYJluxWH6cM',
    currency: "GBP",
    intent: "capture",
  };
  if (window.location.pathname.includes('beta') || window.location.hostname === 'localhost') {
    paypalOptions['client-id'] = 'AZg2v5veSxPSlZ-Zw2SVKJfls-cKCtIDxvFBpTQ3Bfz-jRXG_iIlO6fXnLIuXV158pWfcbgxgDhdH3wT';
  }
  // console.log(paypalOptions);

  switch (app) {
    case 'login':
      return (
        <Auth0Provider {...auth} scope="member">
          <LoginButton label='Member Login'/>
        </Auth0Provider>
      );
    case 'boat':
      return (
        <Auth0Provider {...auth} scope="member">
          <OGAProvider>
            <Boat location={window.location} />
          </OGAProvider>
        </Auth0Provider>
      );
    case 'my_fleets':
      return (
        <Auth0Provider {...auth} scope="member">
          <OGAProvider>
            <MyFleets location={window.location} />
          </OGAProvider>
        </Auth0Provider>
      );
    case 'shared_fleets':
      return (
        <Auth0Provider {...auth} scope="member">
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
    case 'rbc60_entries': // 60
      return (
        <PayPalScriptProvider options={paypalOptions}>
          <Auth0Provider {...auth} scope="member">
            <OGAProvider>
              <RBC60Entryies />
            </OGAProvider>
          </Auth0Provider>
        </PayPalScriptProvider>
        )
        ;
    case 'rbc60_crew':
      return (
          <Auth0Provider {...auth} scope="member">
            <OGAProvider>
              <RBC60CrewForm />
            </OGAProvider>
          </Auth0Provider>
          )
          ;
    case 'oga60_interest':
      return (
          <Auth0Provider {...auth} scope="member">
            <OGAProvider>
              <OGA60Interest />
            </OGAProvider>
          </Auth0Provider>
          )
          ;
      default:
      console.log('browse', app);
      return (
        <Auth0Provider {...auth} scope="member">
          <OGAProvider>
            <BrowseApp view={app} />
          </OGAProvider>
        </Auth0Provider>
      );
  }
};

const tags = [
  'app', 'boat', 'sell', 'small', 'pending', 'yearbook', 'my_fleets', 'shared_fleets',
  'rbc60', 'rbc60_entries', 'rbc60_crew', 'oga60_interest', 'login',
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
