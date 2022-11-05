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
import RBC60Entries from './components/rbc60entries';
import RBC60CrewForm from './components/rbc60crewform';
import OGA60Button from './components/oga60button';
import LoginButton from './components/loginbutton';
import OGA60Form from './components/oga60form';
import TokenProvider from './components/TokenProvider';
import ViewTable from './components/viewtable';

const theme = createTheme({
  palette: {
    secondary: red,
  },
});

const Pages = ({ app, topic }) => {
  console.log('Pages', app, topic);
  const red = window.location.origin + window.location.pathname;
  console.log(red);
  const auth = {
    domain: "dev-uf87e942.eu.auth0.com",
    clientId: "Mlm45jI7zvoQXbLSYSNV8F1qI1iTEnce",
    redirectUri: red,
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
          <LoginButton label='Member Login' />
        </Auth0Provider>
      );
    case 'boat':
      return (
        <Auth0Provider {...auth} scope="member">
          <TokenProvider>
            <OGAProvider>
              <Boat location={window.location} />
            </OGAProvider>
          </TokenProvider>
        </Auth0Provider>
      );
    case 'my_fleets':
      return (
        <Auth0Provider {...auth} scope="member">
          <TokenProvider>
            <OGAProvider>
              <MyFleets location={window.location} />
            </OGAProvider>
          </TokenProvider>
        </Auth0Provider>
      );
    case 'shared_fleets':
      return (
        <Auth0Provider {...auth} scope="member">
          <TokenProvider>
            <OGAProvider>
              <SharedFleets location={window.location} />
            </OGAProvider>
          </TokenProvider>
        </Auth0Provider>
      );
    case 'pending':
      return (
        <Auth0Provider {...auth} scope="member">
          <TokenProvider>
            <OGAProvider>
              <ProcessUpdates />
            </OGAProvider>
          </TokenProvider>
        </Auth0Provider>)
        ;
    case 'yearbook':
      return (
        <Auth0Provider {...auth} scope="member">
          <TokenProvider>
            <OGAProvider>
              <Yearbook />
            </OGAProvider>
          </TokenProvider>
        </Auth0Provider>)
        ;
    case 'rbc60':
      return (
        <PayPalScriptProvider options={paypalOptions}>
          <Auth0Provider {...auth} scope="member">
            <TokenProvider>
              <OGAProvider>
                <RBC60 />
              </OGAProvider>
            </TokenProvider>
          </Auth0Provider>
        </PayPalScriptProvider>
      )
        ;
    case 'rbc60_entries': // 60
      return (
        <PayPalScriptProvider options={paypalOptions}>
          <Auth0Provider {...auth} scope="member">
            <TokenProvider>
              <OGAProvider>
                <RBC60Entries />
              </OGAProvider>
            </TokenProvider>
          </Auth0Provider>
        </PayPalScriptProvider>
      )
        ;
    case 'rbc60_crew':
      return (
        <Auth0Provider {...auth} scope="member">
          <TokenProvider>
            <OGAProvider>
              <RBC60CrewForm />
            </OGAProvider>
          </TokenProvider>
        </Auth0Provider>
      )
        ;
    case 'oga60_button':
      return (
        <Auth0Provider {...auth} scope="member">
          <TokenProvider>
            <OGAProvider>
              <OGA60Button />
            </OGAProvider>
          </TokenProvider>
        </Auth0Provider>
      )
        ;
    case 'oga60_interest':
      return (
        <Auth0Provider {...auth} scope="member">
          <TokenProvider>
            <OGAProvider>
              <OGA60Form />
            </OGAProvider>
          </TokenProvider>
        </Auth0Provider>
      )
        ;
    case 'expressions':
      {
        return (
          <Auth0Provider {...auth} scope="member">
            <TokenProvider>
              <OGAProvider>
                <ViewTable scope='editor' table='expression_of_interest' params={{topic}} />
              </OGAProvider>
            </TokenProvider>
          </Auth0Provider>
        );
      }
    default:
      console.log('browse', app);
      return (
        <Auth0Provider {...auth} scope="member">
          <TokenProvider>
            <OGAProvider>
              <BrowseApp view={app} />
            </OGAProvider>
          </TokenProvider>
        </Auth0Provider>
      );
  }
};

const tags = [
  'app', 'boat', 'sell', 'small', 'pending', 'yearbook', 'my_fleets', 'shared_fleets',
  'rbc60', 'rbc60_entries', 'rbc60_crew', 'oga60_button', 'oga60_interest', 'login', 'expressions',
];
const divs = tags.filter((id) => document.getElementById(id));
divs.forEach((tag) => {
  const div = document.getElementById(tag);
  const topic = div.getAttribute('topic');
  ReactDOM.render(
    <React.StrictMode>
      <CookiesProvider>
        <ThemeProvider theme={theme}>
          <Pages app={tag} topic={topic} />
        </ThemeProvider>
      </CookiesProvider>
    </React.StrictMode>,
    div
  );
});

// serviceWorker.unregister();
