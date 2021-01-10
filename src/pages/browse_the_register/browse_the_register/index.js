import React from "react"
import ApolloClient from "apollo-client"; // N.B. only needed for the enquiry mutation
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import BrowseBoats from '../../../components/browseboats';
import { usePicklists } from '../../../util/picklists';

const defaultState = {
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
  
  const { loading, error, data } = usePicklists();

  if (loading) return (<p>Loading...</p>);
  if (error) return (<p>Error :(Browse the Register)</p>);

  const handlePageSizeChange = (a) => {
    console.log('Browse the Register page size change', a);
  };

  const handleSortChange = (field, dir) => {
    console.log('Browse the Register sortchange', field, dir);
  }

  const handleFilterChange = (f) => {
    console.log('Browse the Register filter change', f);
  }

  return (
    <ApolloProvider client={client}>
      <BrowseBoats 
        pickers={data} state={location.state || defaultState}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
      />);
    </ApolloProvider>
  );

  }