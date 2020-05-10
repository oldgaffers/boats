import React from 'react';
import ApolloClient from "apollo-client";
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { useRoutes } from 'hookrouter';
import './App.css';
import BrowseBoats from './components/browseboats';
import Boat from './components/boat';
import Designers from './components/designers';
import Builders from './components/builders';
import Fleets from './components/fleets';
import About from './components/about';
import Support from './components/support';
import Tech from './components/tech';
import YourEditors from './components/youreditors';

const client = new ApolloClient({
  link: createHttpLink({
    uri: "https://api-oga.herokuapp.com/v1/graphql",
  }),
  cache: new InMemoryCache()
});

const routes = {
  "/": () => <ApolloProvider client={client}><BrowseBoats /></ApolloProvider>, // keeps tests working
  "/boats/": () => <ApolloProvider client={client}><BrowseBoats /></ApolloProvider>,
  "/boats/boat/:id": ({id}) => <ApolloProvider client={client}><Boat id={id}/></ApolloProvider>,
  "/boats/designers": () => <Designers />,
  "/boats/builders": () => <Builders />,
  "/boats/fleets": () => <Fleets />,
  "/boats/about": () => <About />,
  "/boats/editors": () => <YourEditors />,
  "/boats/support": () => <Support />,
  "/boats/tech": () => <Tech />
};

function App() {
  const routeResult = useRoutes(routes)
  return routeResult
}

export default App;
