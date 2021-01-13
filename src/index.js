import 'react-app-polyfill/ie11';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { CookiesProvider } from 'react-cookie';
import useAxios from 'axios-hooks'
import OGAProvider from './util/gql';
import Link from './components/link';
import GqlBoatBrowser from './components/GqlBoatBrowser';
import BoatWrapper from './components/boatwrapper';

const Boat = ({location}) => {

  const params = new URLSearchParams(location.search);
  const oga_no = params.get('oga_no');
  
  const [b] = useAxios(
    `https://ogauk.github.io/boatregister/page-data/boat/${oga_no}/page-data.json`
  )

  useEffect(() => {
    if (b.data) {
       document.title = `${b.data.result.pageContext.boat.name} (${b.data.result.pageContext.boat.oga_no})`;
    }
  });

  if (b.loading) return <p>Loading...</p>
  if (b.error) {
      if (oga_no) {
          return (<div>
              Sorry, we had a problem getting the data for
              the boat with OGA number {oga_no}
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

const browse = {
  page: 1,
  boatsPerPage: '12', 
  sortField: 'editors_choice', 
  sortDirection: 'asc',
  filters: { sale: false }, 
};

const buy = {
  page: 1,
  boatsPerPage: '12', 
  sortField: 'price', 
  sortDirection: 'desc',
  filters: { sale: true }, 
};

const handlePageSizeChange = (bpp) => {
  console.log('page size change', bpp);
};

const handleSortChange = (field, dir) => {
  console.log('sortchange', field, dir);
}

const handleFilterChange = (filters) => {
  console.log('filter change', filters);
}

const handlePageChange = (page) => {
  console.log('page change', page);
}

const Wanted = () => {
  const { location } = window;
  if(location.href.includes('boats_for_sale')) {
    console.log('sale');
    return (
      <GqlBoatBrowser
        title='Boats for Sale'
        defaultState={buy}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        link={Link}
        location={location}
      />
    );
  }
  if(location.href.includes('register.html')) {
    console.log('register');
    return (
      <GqlBoatBrowser
        title='Browse the Register'
        defaultState={browse}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        link={Link}
        location={location}
      />
    );
  }
  console.log('boat');
  return <Boat location={location} />;
};

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <OGAProvider>
        <Wanted />
      </OGAProvider>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
