import React from "react"
import ApolloClient from "apollo-client";
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import GqlBoatBrowser from '../../../components/GqlBoatBrowser';

const defaultState = {
  page: 1,
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

export default function BrowseTheRegisterPage() {  
  return (
    <ApolloProvider client={client}>
      <GqlBoatBrowser title='Boats for Sale' defaultState={defaultState}/>
    </ApolloProvider>
  );
}