import React from 'react';
import ApolloClient from "apollo-client"; // N.B. only needed for the enquiry mutation
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from '@apollo/react-hooks';
import { useAuth0 } from "@auth0/auth0-react";
  
  export default function OGAProvider({children}) {
    const { isAuthenticated, getTokenSilently } = useAuth0();

    const headers = {};

    if (isAuthenticated) {
      headers.Authorization = `Bearer ${getTokenSilently()}`
    }

    const client = new ApolloClient({
      link: createHttpLink({
        uri: "https://api-oga.herokuapp.com/v1/graphql",
        headers,
      }),
      cache: new InMemoryCache()
    });

    return (<ApolloProvider client={client}>{children}</ApolloProvider>);
  }