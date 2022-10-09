import React, { useState, useEffect } from 'react';
import { InMemoryCache, ApolloClient, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/react-hooks';
import { useAuth0 } from "@auth0/auth0-react";
import { setContext } from 'apollo-link-context'

const httpLink = new HttpLink({
  uri: 'https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/graphql' // "https://api-oga.herokuapp.com/v1/graphql",
})

const anonymousClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default function OGAProvider({children}) {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [accessToken, setAccessToken] = useState();
    const [client, setClient] = useState(anonymousClient);

    useEffect(() => {
      const getAccessToken = async () => {
        if (isAuthenticated) {
          const token = await getAccessTokenSilently()
          setAccessToken(token)
        }
      }
      getAccessToken();
    }, [isAuthenticated, getAccessTokenSilently])

    useEffect(() => {
      const authLink = setContext((_, { headers }) => {
        if (accessToken) {
          return {
            headers: {
              ...headers,
              authorization: `Bearer ${accessToken}`,
            },
          }
        } else {
          return {
            headers: {
              ...headers,
            },
          }
        }
      });  
      const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
      })
      setClient(client)
    }, [accessToken]);

    return (<ApolloProvider client={client}>{children}</ApolloProvider>);
  }