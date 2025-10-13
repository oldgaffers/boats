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
import TokenProvider from './components/TokenProvider';

import BrowseApp from './components/browseapp';
import Boat from './components/boat';
import FleetView, { Fleets } from './components/fleetview';
import LoginButton from './components/loginbutton';
import CreateBoatButton from './components/createboatbutton';
import CustomMap from './components/custommap';

import PickOrAddBoat from './components/pick_or_add_boat';
import BuilderPage from './components/builderpage';

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
  const paypalOptions = {
    "client-id": 'Ab7dxlH_fK99yWWn7Z2V9WdaSiX1H26jJLtfIQ4sOcgFtqYklvaxTLZgXCSwOb2scdRGIRYJluxWH6cM',
    currency: "GBP",
    intent: "capture",
  };
  if (window.location.pathname.includes('beta') || window.location.hostname === 'localhost') {
    paypalOptions['client-id'] = 'AZg2v5veSxPSlZ-Zw2SVKJfls-cKCtIDxvFBpTQ3Bfz-jRXG_iIlO6fXnLIuXV158pWfcbgxgDhdH3wT';
  }

  return <PayPalScriptProvider options={paypalOptions}>
    <Auth0Provider {...auth} scope={scope}>
      <TokenProvider>
        <OGAProvider>
          {children}
        </OGAProvider>
      </TokenProvider>
    </Auth0Provider>
  </PayPalScriptProvider>
}

const Pages = (props) => {
  const params = new URLSearchParams(window.location.search);
  const kvp = {};
  for (const [key, value] of params.entries()) {
    kvp[key] = value;
  }
  switch (props.ogaComponent) {
    case 'app':
      if (window.location.pathname.includes('/boat/')) {
        return <Boat {...props} location={window.location} />;
      }
      return <BrowseApp view='app' />;
    case 'login': return <LoginButton />;
    case 'boat': return <Boat {...props} location={window.location} />;
    case 'fleet': return <FleetView {...props} />;
    case 'my_fleets': return <Fleets filter={{ owned: true }} {...props} />;
    case 'shared_fleets': return <Fleets filter={{ public: true}} {...props} />;
    case 'map': return <CustomMap {...props} />;
    case 'add_boat': return <CreateBoatButton {...props} />;
    case 'pick_or_add_boat': return <PickOrAddBoat {...props} />;
    case 'builder': return <BuilderPage {...props} {...kvp} />;
    default:
      // sail, sell, small, ...
      return <BrowseApp view={props.ogaComponent} {...props} />;
  }
};

const BoatRegister = (props) => {
  const red = window.location.origin + window.location.pathname;
  return <React.StrictMode>
    <CookiesProvider>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Wrapper redirectUri={red} scope={props.scope || 'member'}>
          <Pages {...props} />
        </Wrapper>
      </ThemeProvider>
    </CookiesProvider>
  </React.StrictMode>;
};

const allparas = document.getElementsByTagName('p');
for (let i = 0; i < allparas.length; i++) {
  const p = allparas.item(i);
  const text = p.innerText;
  const q = text.match(/^<<(.*?):(.*)>>$/);
  if (q?.length === 3) {
    const [, component, arglist] = q;
    const args = arglist.split(':');
    createRoot(p).render(<BoatRegister ogaComponent={component} args={args} />);
  }
}
const placeholders = document.querySelectorAll("[data-oga-component]");
placeholders.forEach((ph) => {
  const attr = ph.dataset;
  createRoot(ph).render(<BoatRegister {...attr} />);
});

// serviceWorker.unregister();
