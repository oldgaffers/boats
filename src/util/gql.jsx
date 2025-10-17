import { useState, useEffect, useContext } from 'react';
import { InMemoryCache, ApolloClient, HttpLink } from '@apollo/client';
import { ApolloProvider } from "@apollo/client/react";
import { SetContextLink } from "@apollo/client/link/context";
import { TokenContext } from '../components/TokenProvider';
const httpLink = new HttpLink({
  uri: 'https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/graphql' // "https://api-oga.herokuapp.com/v1/graphql",
})

const anonymousClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default function OGAProvider({ children }) {
  const [client, setClient] = useState(anonymousClient);

  const token = useContext(TokenContext);

  useEffect(() => {
    const authLink = new SetContextLink((prevContext, operation) => {
      return {
        headers: {
          ...prevContext.headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    });
    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    })
    setClient(client)
  }, [token]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}