import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CookiesProvider } from "react-cookie";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import BrowseApp from './components/browseapp';
import Boat from './components/boat';
import FleetView, { Fleets } from './components/fleetview';
import LoginButton from './components/loginbutton';
import CustomMap from './components/custommap';
import EditButton from './components/editbutton';
import PickOrAddBoat from './components/pick_or_add_boat';
import BuilderPage from './components/builderpage';
import PrivateDocument from "./components/PrivateDocument";

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

function Wrapper({ redirectUri, scope, children }) {

  const paypalOptions = {
    "client-id": 'Ab7dxlH_fK99yWWn7Z2V9WdaSiX1H26jJLtfIQ4sOcgFtqYklvaxTLZgXCSwOb2scdRGIRYJluxWH6cM',
    currency: "GBP",
    intent: "capture",
  };
  if (window.location.pathname.includes('beta') || window.location.hostname === 'localhost') {
    paypalOptions['client-id'] = 'AZg2v5veSxPSlZ-Zw2SVKJfls-cKCtIDxvFBpTQ3Bfz-jRXG_iIlO6fXnLIuXV158pWfcbgxgDhdH3wT';
  }
  // scope={scope}>
  console.log('Wrapper scope:', scope);
  return <PayPalScriptProvider options={paypalOptions}>
    <Auth0Provider
      domain="dev-uf87e942.eu.auth0.com"
      clientId="Mlm45jI7zvoQXbLSYSNV8F1qI1iTEnce"
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: "https://oga.org.uk/boatregister",
        scope: "openid profile email offline_access",
      }}
      useRefreshTokens={true}
      cacheLocation='localstorage'
    >
      {children}
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
    case 'shared_fleets': return <Fleets filter={{ public: true }} {...props} />;
    case 'map': return <CustomMap {...props} />;
    case 'add_boat': return <EditButton boat={{}} label='Add Boat' {...props} />;
    case 'pick_or_add_boat': return <PickOrAddBoat {...props} />;
    case 'builder': return <BuilderPage {...props} {...kvp} />;
    case 'doc': return <PrivateDocument {...props} />;
    default:
      // sail, sell, small, ...
      return <BrowseApp view={props.ogaComponent} {...props} />;
  }
};

export function BoatRegister(props) {
  const red = window.location.origin + window.location.pathname;
  return <CookiesProvider>
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Wrapper redirectUri={red} scope={props.scope || 'member'}>
        <Pages {...props} />
      </Wrapper>
    </ThemeProvider>
  </CookiesProvider>;
};
