import React from "react"
import ApolloClient from "apollo-client"; // N.B. only needed for the enquiry mutation
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import BrowseBoats from '../../../components/browseboats';
import { usePicklists } from '../../../util/picklists';

const defaultState = {
  boatsPerPage: '12', 
  sortField: 'price', 
  sortDirection: 'desc',
  filters: { sale: true }, 
};

const client = new ApolloClient({
    link: createHttpLink({
      uri: "https://api-oga.herokuapp.com/v1/graphql",
    }),
    cache: new InMemoryCache()
  });
  
const Browser = ({location, defaultState }) => {
  const { loading, error, data } = usePicklists();

  if (loading) return (<p>Loading...</p>);
  if (error) return (<p>Error :(Boats for Sale)</p>);

  const handlePageSizeChange = (a) => {
    console.log('Boats for Sale page size change', a);
  };

  const handleSortChange = (field, dir) => {
    console.log('Boats for Sale sortchange', field, dir);
  }

  const handleFilterChange = (f) => {
    console.log('Boats for Sale filter change', f);
  }

  return (
      <BrowseBoats 
        pickers={data} state={location.state || defaultState}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
      />
  );
};

export default function BrowseTheRegisterPage({ location }) {
  return (
    <ApolloProvider client={client}>
      <Browser location={location} defaultState={defaultState}/>;
    </ApolloProvider>
  );
}