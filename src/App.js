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
  "/": () => <ApolloProvider client={client}><BrowseBoats dir='asc'/></ApolloProvider>,
  "/boat/:id": ({id}) => <ApolloProvider client={client}><Boat id={id}/></ApolloProvider>,
  "/boat/:id/:dir": ({id, dir}) => <ApolloProvider client={client}><Boat sortDirection={dir} id={id}/></ApolloProvider>,
  "/designers": () => <Designers />,
  "/builders": () => <Builders />,
  "/fleets": () => <Fleets />,
  "/about": () => <About />,
  "/editors": () => <YourEditors />,
  "/support": () => <Support />,
  "/tech": () => <Tech />,
  "/:dir": (dir) => <ApolloProvider client={client}><BrowseBoats dir={dir} /></ApolloProvider>, 
  /*
  "/": () => <ApolloProvider client={client}><BrowseBoats dir='asc'/></ApolloProvider>, // keeps tests working
  "/asc": () => <ApolloProvider client={client}><BrowseBoats dir='asc' /></ApolloProvider>, // keeps tests working
  "/desc": () => <ApolloProvider client={client}><BrowseBoats dir='desc'/></ApolloProvider>, // keeps tests working
  "/boats/:dir": (dir) => <ApolloProvider client={client}><BrowseBoats dir={dir}/></ApolloProvider>,
  "/boats/boat/:id/:dir": (id, dir) => <ApolloProvider client={client}><Boat sortDirection={dir} id={id}/></ApolloProvider>,
  "/boat/:id/:dir": (id, dir) => <ApolloProvider client={client}><Boat sortDirection={dir} id={id}/></ApolloProvider>,
  "/boats/designers": () => <Designers />,
  "/boats/builders": () => <Builders />,
  "/boats/fleets": () => <Fleets />,
  "/boats/about": () => <About />,
  "/boats/editors": () => <YourEditors />,
  "/boats/support": () => <Support />,
  "/boats/tech": () => <Tech />
  */
};

function App() {
  const routeResult = useRoutes(routes)
  return routeResult
}

export default App;
