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
import CreateBoatButton from './components/createboatbutton';
import PickOrAddBoat from './components/pick_or_add_boat';

import CustomMap from './components/custommap';


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

function getOgaNo() {
  const params = new URLSearchParams(window.location.search);
  const qp = params.get('oga_no');
  if (qp) {
    return Number(qp);
  }
  const path = window.location.pathname?.split('/') || ['boat', ''];
  const p = path.indexOf('boat') + 1;
  if (Number(path[p]) !== 0) {
    return Number(path[p]);
  }
  return 0;
}

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
  const app = props.id;
  switch (app) {
    case 'app':
      if (window.location.pathname.includes('/boat/')) {
        return <Boat ogaNo={getOgaNo()} />;
      }
      return <BrowseApp view='app' />;
    case 'login':
      return <LoginButton />;
    case 'boat':
      return <Boat ogaNo={getOgaNo()} />;
    case 'fleet':
      return <FleetView {...props} location={window.location} />;
    case 'my_fleets':
      return <MyFleets {...props} />;
    case 'shared_fleets':
      return <SharedFleets {...props} />;
    case 'map':
      return <CustomMap {...props} />;
    case 'add_boat':
      return <CreateBoatButton {...props} />;
    case 'pick_or_add_boat':
      return <PickOrAddBoat {...props} />;
    default:
      return <BrowseApp view={app} {...props} />;
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

const tags = [
  'app', 'boat', 'fleet', 'sail', 'sell', 'small', 
  'login', 
  'pending',
  'expressions', 'add_boat', 'pick_or_add_boat',
  'my_fleets', 'shared_fleets',
];

const alldivs = document.getElementsByTagName('div');
for (let i = 0; i < alldivs.length; i++) {
  const div = alldivs.item(i);
  const attr = div.dataset;
  // oga-component is converted to ogaComponent by the browser
  if (attr.ogaComponent) {
    createRoot(div).render(<BoatRegister id={attr.ogaComponent} {...attr} />);    
  } else {
    const attrKeys = Object.keys(attr);
    const wanted = tags.find((tag) => attrKeys.includes(tag));
    if (wanted) {
      createRoot(div).render(<BoatRegister id={wanted} {...attr} />);
    } else {
      // legacy
      const id = div.getAttribute('id');
      if (tags.includes(id)) {
        createRoot(div).render(<BoatRegister id={id} {...attr} />);
      }
    }  
  }
}

// serviceWorker.unregister();
