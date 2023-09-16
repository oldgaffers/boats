import 'react-app-polyfill/ie11';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from "@auth0/auth0-react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
// import * as serviceWorker from './serviceWorker';
import { CookiesProvider } from "react-cookie";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import OGAProvider from "./util/gql";
import BrowseApp from './browseapp';
import Boat from './components/boat';
import MyFleets from './components/myfleets';
import SharedFleets from './components/sharedfleets';
import FleetView from './components/fleetview';
import LoginButton from './components/loginbutton';
import TokenProvider from './components/TokenProvider';


import RCBEntryMap from './components/rbc60map';
import RBC60 from './components/rbc60';
import RBC60Entries from './components/rbc60entries';
import RBC60CrewForm from './components/rbc60crewform';
import OGA60Button from './components/oga60button';
import OGA60Form from './components/oga60form';
import CreateBoatButton from './components/createboatbutton';
import PickOrAddBoat from './components/pick_or_add_boat';

/*
import { lazy } from 'react';
const RCBEntryMap = lazy(()=> import('./components/rbc60map'));
const RBC60 = lazy(()=> import('./components/rbc60'));
const RBC60Entries = lazy(()=> import('./components/rbc60entries'));
const RBC60CrewForm = lazy(()=> import('./components/rbc60crewform'));
const OGA60Button = lazy(()=> import('./components/oga60button'));
const OGA60Form = lazy(()=> import('./components/oga60form'));
const CreateBoatButton = lazy(()=> import('./components/createboatbutton'));
const PickOrAddBoat = lazy(()=> import('./components/pick_or_add_boat'));
*/

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

function Wrapper({ redirectUri, scope, children }) {
  const auth = {
    domain: "dev-uf87e942.eu.auth0.com",
    clientId: "Mlm45jI7zvoQXbLSYSNV8F1qI1iTEnce",
    redirectUri: redirectUri,
    audience: "https://oga.org.uk/boatregister",
    useRefreshTokens: true,
    cacheLocation: 'localstorage',
  }
  return <Auth0Provider {...auth} scope={scope}>
  <TokenProvider>
    <OGAProvider>
      {children}
    </OGAProvider>
  </TokenProvider>
</Auth0Provider>
}

const Pages = (props) => {
  const app = props.id;
  const red = window.location.origin + window.location.pathname;
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
          <LoginButton />
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
    case 'fleet':
      return <Wrapper {...auth} scope="member">
        <FleetView {...props} location={window.location} />
      </Wrapper>;
    case 'my_fleets':
      return <Wrapper {...auth} scope="member">
          <MyFleets />
        </Wrapper>;
    case 'shared_fleets':
      return <Wrapper {...auth} scope="member">
          <SharedFleets/>
        </Wrapper>;
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
    case 'rbc60_map':
      return <Auth0Provider {...auth} scope="member">
        <TokenProvider>
          <OGAProvider>
            <RCBEntryMap />
          </OGAProvider>
        </TokenProvider>
      </Auth0Provider>
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
    case 'add_boat':
      return <CreateBoatButton />;
    case 'pick_or_add_boat':
      return <PickOrAddBoat />;
    default:
      // console.log('browse', app);
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
  'app', 'boat', 'fleet', 'my_fleets', 'shared_fleets',
  'sail', 'sell', 'small', 'pending',
  'rbc60', 'rbc60_entries', 'rbc60_map', 'rbc60_crew',
  'oga60_button', 'oga60_interest',
  'login', 'expressions', 'add_boat', 'pick_or_add_boat',
  
];
console.log(window.location);
const iddivs = tags.map((id) => document.getElementById(id)).filter((div) => div);
const brdivs = tags.map((tag) => {
  const c = document.getElementsByClassName(`br_${tag}`);
  return [...c];
}).flat();
[...iddivs, ...brdivs].forEach((div) => {
  const attributes = {};
  div.getAttributeNames().forEach((name) => {
    if (name === 'class') {
      const val = div.getAttribute(name);
      if (val.includes('br_')) {
        const names = val.split(' ');
        names.forEach((n) => {
          if (n.startsWith('br_')) {
            attributes['id'] = n.replace('br_', '');            
          }
        });
      }
    } else {
      attributes[name] = div.getAttribute(name);
    }
  });
  const root = createRoot(div);
  root.render(
    <React.StrictMode>
      <CookiesProvider>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <Pages {...attributes} />
        </ThemeProvider>
      </CookiesProvider>
    </React.StrictMode>
  );
});

// serviceWorker.unregister();
