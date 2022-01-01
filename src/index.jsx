import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from "@auth0/auth0-react";
import * as serviceWorker from './serviceWorker';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CookiesProvider } from "react-cookie";
import OGAProvider from "./util/gql";
import BrowseApp from './browseapp';
import Boat from './components/boat';
import red from '@mui/material/colors/red';

const theme = createTheme({
  palette: {
    secondary: red,
  },
});

const tags = ['app', 'boat', 'sell', 'small'];
const div = tags.filter((id) => document.getElementById(id));
if (div.length>0) {
  const app = div[0];
  ReactDOM.render(
    <React.StrictMode>
      <Auth0Provider
        domain="dev-uf87e942.eu.auth0.com"
        clientId="Mlm45jI7zvoQXbLSYSNV8F1qI1iTEnce"
        redirectUri={window.location.origin + window.location.pathname}
        audience="https://oga.org.uk/boatregister"
        scope="member"
      >
        <CookiesProvider>
          <OGAProvider>
            <ThemeProvider theme={theme}>
              { (app === 'boat')
                ?
                (<Boat location={window.location}/>)
                :
                (<BrowseApp variant={app}/>)
              }
            </ThemeProvider>
          </OGAProvider>
        </CookiesProvider>
      </Auth0Provider>
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

serviceWorker.unregister();
