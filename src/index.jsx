import 'react-app-polyfill/ie11';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from "@auth0/auth0-react";
import auth0Client from "@auth0/auth0-spa-js";
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

const auth0Params = {
  domain: "dev-uf87e942.eu.auth0.com",
  clientId: "Mlm45jI7zvoQXbLSYSNV8F1qI1iTEnce",
}

const tags = [
  'app',
  'boat',
  'fleet',
  'sail',
  'sell',
  'small',
  'login',
  'pending',
  'expressions',
  'add_boat',
  'pick_or_add_boat',
  'my_fleets',
  'shared_fleets',
];

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
    domain: auth0Params.domain,
    clientId: auth0Params.clientId,
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
    case 'login': return <LoginButton />;
    case 'boat': return <Boat ogaNo={getOgaNo()} />;
    case 'fleet': return <FleetView {...props} location={window.location} />;
    case 'my_fleets': return <Fleets filter={{ owned: true }} />;
    case 'shared_fleets': return <Fleets filter={{ public: true }} />;
    case 'map': return <CustomMap {...props} />;
    case 'add_boat': return <CreateBoatButton {...props} />;
    case 'pick_or_add_boat': return <PickOrAddBoat {...props} />;
    default:
      // sail, sell, small, ...
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

function getPopoutButton(className) {
  return document.getElementsByClassName(className)?.item(0)?.parentElement?.parentElement;
}

const takeoverbuttons = () => {
  // const phoneButton = getPopoutButton('fa-phone');
  // const emailButton = getPopoutButton('fa-envelope');
  const userButton = getPopoutButton('fa-user');
  console.log('userButton', userButton);
  // console.log('token', token);
  if (userButton) {
    const logoutFn = auth0Client.logout;
    console.log('auth0Client.logout', logoutFn));
    const k = Object.keys(localStorage).find(k => k.includes('auth0spajs'))
    const authData = JSON.parse(localStorage[k]);
    const user = authData.body.decodedToken.user;
    userButton.removeAttribute('href');
    userButton.style = 'cursor: pointer';
    userButton.innerHTML = '<span class="schoolPopout__circle" style="overflow: hidden; border-radius:50%"><img height="30px" alt="' + user.name + '" src="' + user.picture + '"></span><span class="schoolPopout__label" style="color: red">Logout</span>';
    userButton.addEventListener("click", (e) => {
      const logout = logoutFn;
      console.log('L', logout);
      e.preventDefault();
      logout();
    });
  }
}

const k = Object.keys(localStorage).find(k => k.includes('auth0spajs'))
if (k) {
  const authData = JSON.parse(localStorage[k]);
  const token = authData?.body?.decodedToken;
  const user = token?.user;
  if (user && [1219, 559].includes(user['https://oga.org.uk/id'])) {
    // console.log('from local storage', user.name);
    window.setTimeout(takeoverbuttons, 1000);
    if (document.readyState === "loading") {
      // Loading hasn't finished yet
      document.addEventListener("DOMContentLoaded", takeoverbuttons);
    } else {
      // `DOMContentLoaded` has already fired
      takeoverbuttons();
    }
  }
}

const allparas = document.getElementsByTagName('p');
for (let i = 0; i < allparas.length; i++) {
  const p = allparas.item(i);
  const text = p.innerText;
  const q = text.match(/^<<(.*):(.*)>>$/);
  if (q?.length === 3) {
    const [, component, args] = q;
    // console.log('X', component, args);
    createRoot(p).render(<BoatRegister id={component} fleet={args} />);
  }
}
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
