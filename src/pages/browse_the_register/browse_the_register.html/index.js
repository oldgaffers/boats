import React from "react"
import ApolloClient from "apollo-client";
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import GqlBoatBrowser from '../../../components/GqlBoatBrowser';

const defaultState = {
  page: 1,
  boatsPerPage: '12', 
  sortField: 'editors_choice', 
  sortDirection: 'asc',
  filters: { sale: false }, 
};

const client = new ApolloClient({
    link: createHttpLink({
      uri: "https://api-oga.herokuapp.com/v1/graphql",
    }),
    cache: new InMemoryCache()
});

export default function BrowseTheRegisterPage({ location }) {
  const state = {...defaultState};
  if (location.search !== '') {
    const params = new URLSearchParams(location.search);
    for (const [key, value] of params) {
      switch (key) {
        case 'p':
          state.page = parseInt(value, 10);
          break;
        case 'bpp':
          state.boatsPerPage = value;
          break;
        case 'sort':
          state.sortField = value;
          break;
        case 'asc':
          state.sortDirection = value==='true' ? 'asc' : 'desc';
          break;
        case 'y':
          const year = {};
          const [firstYear, lastYear] = value.split('-');
          if (firstYear !== '') {
            year.firstYear = firstYear;
          }
          if (lastYear !== '') {
            year.lastYear = lastYear;
          }
          state.filters.year = year;
          break;
        default:
          state.filters[key] = value;
      }
    }
    // window.location.search = '';  
  }

  return (
    <ApolloProvider client={client}>
      <GqlBoatBrowser title="Browse the Register" defaultState={state} />
    </ApolloProvider>
  );
}