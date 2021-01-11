import ApolloClient from "apollo-client"; // N.B. only needed for the enquiry mutation
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from '@apollo/react-hooks';

const client = new ApolloClient({
    link: createHttpLink({
      uri: "https://api-oga.herokuapp.com/v1/graphql",
    }),
    cache: new InMemoryCache()
  });
  
  export default function OGAProvider({children}) {
      return (<ApolloProvider client={client}>{children}</ApolloProvider>);
  }