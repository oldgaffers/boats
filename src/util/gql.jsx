import React, { useState, useEffect, useContext } from 'react';
import { InMemoryCache, ApolloClient, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from 'apollo-link-context'
import { TokenContext } from '../components/TokenProvider';
const httpLink = new HttpLink({
  uri: 'https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/graphql' // "https://api-oga.herokuapp.com/v1/graphql",
})

const anonymousClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default function OGAProvider({children}) {
    const [client, setClient] = useState(anonymousClient);

    const accessToken = useContext(TokenContext);

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

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
  }