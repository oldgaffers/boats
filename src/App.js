import React from 'react';
import ApolloClient from "apollo-client";
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { useRoutes } from 'hookrouter';
import './App.css';
import BrowseBoats from './components/browseboats';
import Boat from './components/boat';

const client = new ApolloClient({
  link: createHttpLink({
    uri: "https://api-oga.herokuapp.com/v1/graphql",
  }),
  cache: new InMemoryCache()
});

const routes = {
  "/boats/": () => <ApolloProvider client={client}><BrowseBoats /></ApolloProvider>,
  "/boats/boat/:id": ({id}) => <ApolloProvider client={client}><Boat id={id}/></ApolloProvider>,
};

function App() {
  const routeResult = useRoutes(routes)
  return routeResult
}

export default App;
