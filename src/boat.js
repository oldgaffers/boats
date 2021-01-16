import 'react-app-polyfill/ie11';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { CookiesProvider } from 'react-cookie';
import useAxios from 'axios-hooks'
import OGAProvider from './util/gql';
import BoatWrapper from './components/boatwrapper';
import { Link } from './components/mparouter';

const Boat = () => {

  const { location } = window;

  const params = new URLSearchParams(location.search);
  const id = params.get('oga_no');

  const [b] = useAxios(
    `https://ogauk.github.io/boatregister/page-data/boat/${id}/page-data.json`
  )

  useEffect(() => {
    if (b.data) {
       document.title = `${b.data.result.pageContext.boat.name} (${b.data.result.pageContext.boat.oga_no})`;
    }
  });

  if (b.loading) return <p>Loading...</p>
  if (b.error) {
      if (id) {
          return (<div>
              Sorry, we had a problem getting the data for
              the boat with OGA number {id}
              <p>Please try searching on the <a href={location.origin}>Main Page</a></p>
              </div>);
      } else {
          return (<div>
              If you were looking for a specific boat and know its OGA Number,
              you can add ?oga_no=1 or any other number to the url.
              <p>Otherwise try the <a href={location.origin}>Main Page</a></p>
              </div>);
      }
  }

  const boat = b.data.result.pageContext.boat;
  return <BoatWrapper boat={boat} linkComponent={Link} location={location} />;
};

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <OGAProvider>
        <Boat />
      </OGAProvider>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
