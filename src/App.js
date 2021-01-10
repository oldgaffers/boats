import React from 'react';
import ApolloClient from "apollo-client";
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { Router } from "@reach/router"
import './App.css';
import BrowseBoats from './components/browseboats';
import Boat from './components/boat';
import { usePicklists } from './util/picklists';

const client = new ApolloClient({
  link: createHttpLink({
    uri: "https://api-oga.herokuapp.com/v1/graphql",
  }),
  cache: new InMemoryCache()
});

const defaultState = {
  boatsPerPage: '12', 
  sortField: 'editors_choice', 
  sortDirection: 'asc',
  filters: { sale: false }, 
};

function Register({sale, state}) {
  const { loading, error, data } = usePicklists();

  if (loading) return (<p>Loading...</p>);
  if (error) return (<p>Error :(SearchAndFilterBoats)</p>);

  const initialState = defaultState;
  initialState.filters.sale = true;
  initialState.sortField = 'price';
  initialState.sortDirection = 'desc';

  const handlePageSizeChange = (bpp) => {
  };

  const handleSortChange = (field, dir) => {
  }

  const handleFilterChange = (filters) => {
  }

  return (
  <BrowseBoats
    sale={sale} pickers={data} state={state} defaultState={defaultState} 
    onPageSizeChange={handlePageSizeChange}
    onSortChange={handleSortChange}
    onFilterChange={handleFilterChange}
  />);
}

// https://www.oga.org.uk/boat_register/browse_the_register/boat.html?oga_no=315

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Boat path='/browse_the_register/boat.html' />
        <Register path='/boats_for_sale/boats_for_sale.html' sale={false}/>
        <Register path='/browse_the_register/browse_the_register.html' sale={true}/>
      </Router>
    </ApolloProvider>
  );}

export default App;
