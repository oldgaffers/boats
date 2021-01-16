import React from 'react';
import './App.css';
import GqlBoatBrowser from './components/GqlBoatBrowser';
import OGAProvider from './util/gql';
import Boat from './components/boat';
import Designers from './components/designers';
import Builders from './components/builders';
import Fleets from './components/fleets';
import About from './components/about';
import Support from './components/support';
import Tech from './components/tech';
import Editors from './components/editors';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory,
  Link,
} from "react-router-dom";

const defaultState = {
  page: 1,
  bpp: '12', 
  sort: 'editors_choice', 
  sortDirection: 'asc',
  filters: { sale: false }, 
};

function FourOhFour() {

  const location = useLocation();
  const history = useHistory();

  const { search, pathname, state } = location;

  const sale = pathname === '/boat_register/boats_for_sale/boats_for_sale.html';
 
  if (!state) {
    console.log('app state falsy, setting defaults');
    history.replace('/', defaultState);
  }

  if (sale) {
    if (state) {
      state.filters.sale = true;
      state.sort = 'price';
      state.sortDirection = 'desc';
    } else {
      defaultState.filters.sale = true;
      defaultState.sort = 'price';
      defaultState.sortDirection = 'desc';  
    }
  }

  const handlePageSizeChange = (bpp) => {
    console.log('FourOhFour page size change', bpp);
    history.replace('/', { ...state, bpp });
  };

  const handleSortChange = (field, dir) => {
    console.log('FourOhFour sortchange', field, dir);
    history.replace('/', { ...state, sort: field, sortDirection: dir });
  }

  const handleFilterChange = (filters) => {
    console.log('FourOhFour filter change', filters);
    history.replace('/', { ...state, filters });
  }

  const handlePageChange = (page) => {
    console.log('FourOhFour page change', page);
    history.replace('/', { ...state, page });
  }
 
  if (search !== '') {
    const params = new URLSearchParams(search);
    const path = params.get('p');
    console.log('FourOhFour path', path);
    const oga_no = params.get('oga_no');
    if (oga_no) {
      return (<Redirect to={`/boat/${oga_no}`} />)
    }
    if(path) {
      return (<Redirect to={path} />)
    }
  }
  return (
    <GqlBoatBrowser
      title={sale?'Boats for Sale':'Browse the Register'}
      defaultState={state || defaultState}
      onPageSizeChange={handlePageSizeChange}
      onSortChange={handleSortChange}
      onFilterChange={handleFilterChange}
      onPageChange={handlePageChange}
      link={Link}
      location={location}
    />
  );
} 

function App() {
  return (
    <OGAProvider>
      <Router basename={
          // http is a check for dev mode, production will always be https
          window.location.protocol==='http:'?'/':'/boats'
        }>
          <Switch>
            <Route path="/boat/:id"><Boat /></Route>
            <Route path="/about"><About /></Route>
            <Route path="/designers"><Designers /></Route>
            <Route path="/builders"><Builders /></Route>
            <Route path="/fleets"><Fleets /></Route>
            <Route path="/editors"><Editors /></Route>
            <Route path="/support"><Support /></Route>
            <Route path="/tech"><Tech /></Route>
            <Route path="/"><FourOhFour /></Route>
          </Switch>
      </Router>
    </OGAProvider>
  );
}

export default App;
