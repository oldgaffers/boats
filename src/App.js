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
import { usePicklists } from './util/picklists';

const client = new ApolloClient({
  link: createHttpLink({
    uri: "https://api-oga.herokuapp.com/v1/graphql",
  }),
  cache: new InMemoryCache()
});

function FourOhFour() {

  const location = useLocation();
  const { loading, error, data } = usePicklists();

  if (loading) return (<p>Loading...</p>);
  if (error) return (<p>Error :(SearchAndFilterBoats)</p>);

  if (location.search === '') {
    return (<BrowseBoats pickers={data} />);
  }
  console.log('FourOhFour', JSON.stringify(location));
  const params = new URLSearchParams(location.search);
  const path = params.get('p');
  console.log('FourOhFour path', path);
  if(!path) {
    return (<BrowseBoats pickers={data} />);
  }
  return (<Redirect to={path} />)
}
function App() {
  return (
    <ApolloProvider client={client}>
      <Router basename={
          // http is a check for dev mode, production will always be https
          window.location.protocol==='http:'?'/':'/boats'
        }>
          <Switch>
            <Route path="/boat/:id"><Boat /></Route>
            <Route path="/about"><About /></Route>
            <Route path="/designers"><Designers /></Route>
            <Route path="/builders"><Builders /></Route>
            <Route path="/fleets"><Fleets /></Route>
            <Route path="/editors"><Editors /></Route>
            <Route path="/support"><Support /></Route>
            <Route path="/tech"><Tech /></Route>
            <Route path="/"><FourOhFour /></Route>
          </Switch>
      </Router>
    </ApolloProvider>
  );}

export default App;
