import React from 'react';
import ApolloClient from "apollo-client";
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import './App.css';
import BrowseBoats from './components/browseboats';
import Boat from './components/boat';
import Designers from './components/designers';
import Builders from './components/builders';
import Fleets from './components/fleets';
import About from './components/about';
import Support from './components/support';
import Tech from './components/tech';
import Editors from './components/editors';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";

const client = new ApolloClient({
  link: createHttpLink({
    uri: "https://api-oga.herokuapp.com/v1/graphql",
  }),
  cache: new InMemoryCache()
});

function FourOhFour() {
  const location = useLocation();
  if (location.search === '') {
    return (<BrowseBoats />);
  }
  console.log('FourOhFour', JSON.stringify(location));
  const params = new URLSearchParams(location.search);
  const path = params.get('p');
  console.log('FourOhFour', path);
  return (<Redirect to={path} />)
}

function App() {
  return (
    <Router basename={window.location.protocol==='http:'?'/':'/boats'}>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/boat/:id">
            <ApolloProvider client={client}><Boat /></ApolloProvider>
          </Route>
          <Route path="/about"><About /></Route>
          <Route path="/designers"><Designers /></Route>
          <Route path="/builders"><Builders /></Route>
          <Route path="/fleets"><Fleets /></Route>
          <Route path="/editors"><Editors /></Route>
          <Route path="/support"><Support /></Route>
          <Route path="/tech"><Tech /></Route>
          <Route path="/">{}
            <ApolloProvider client={client}><FourOhFour /></ApolloProvider>
          </Route>
        </Switch>
    </Router>
  );}

export default App;
