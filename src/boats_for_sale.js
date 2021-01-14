import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { CookiesProvider } from 'react-cookie';
import OGAProvider from './util/gql';
import GqlBoatBrowser from './components/GqlBoatBrowser';
import Link from './components/link';

const defaultState = {
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

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <OGAProvider>
        <GqlBoatBrowser
        title='Boats for Sale'
        defaultState={defaultState}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        link={Link}
        location={window.location}
      />
      </OGAProvider>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();