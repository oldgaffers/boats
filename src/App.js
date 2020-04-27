import React from 'react';
import ApolloClient from "apollo-client";
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { useRoutes } from 'hookrouter';
import './App.css';
import Main from './components/main';
import BrowseBoats from './components/browseboats';
import Boat from './components/boat';

require('dotenv').config()

const client = new ApolloClient({
  link: createHttpLink({
    // read-only endpoint
    uri: "https://api-oga.herokuapp.com/v1/graphql",
    headers: {
      "x-hasura-admin-secret": ''
    }
  }),
  cache: new InMemoryCache()
});

const routes = {
  "/": () => <ApolloProvider client={client}><BrowseBoats /></ApolloProvider>,
  "/boats/:id": ({id}) => <ApolloProvider client={client}><Boat id={id}/></ApolloProvider>,
  "/iframe": () => <Main />
};

function App() {
  const routeResult = useRoutes(routes)
  return routeResult
}

export default App;
