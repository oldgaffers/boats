import React, { useState } from "react"
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
  
const Browser = ({ defaultState }) => {
  const { loading, error, data } = usePicklists();
  const [state, setState] = useState(defaultState);

  if (loading) return (<p>Loading...</p>);
  if (error) return (<p>Error :(Browse the Register)</p>);

  const handlePageSizeChange = (bpp) => {
    console.log('Browse the Register page size change', bpp);
    setState({...state, boatsPerPage: bpp });
  };

  const handleSortChange = (field, dir) => {
    console.log('Browse the Register sortchange', field, dir);
    setState({...state, sortField: field, sortDirection: dir });
  }

  const handleFilterChange = (filters) => {
    console.log('Browse the Register filter change', filters);
    setState({...state, filters });
  }

  return (
      <BrowseBoats 
        pickers={data} state={state}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
      />
  );
};

export default function BrowseTheRegisterPage() {  
  return (
    <ApolloProvider client={client}>
      <Browser defaultState={defaultState}/>;
    </ApolloProvider>
  );
}