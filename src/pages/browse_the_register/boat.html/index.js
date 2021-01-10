import React, { useEffect } from "react"
import { Link } from 'gatsby';
import useAxios from 'axios-hooks'
import ApolloClient from "apollo-client"; // N.B. only needed for the enquiry mutation
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import BoatWrapper from '../../../components/boatwrapper';


const client = new ApolloClient({
    link: createHttpLink({
      uri: "https://api-oga.herokuapp.com/v1/graphql",
    }),
    cache: new InMemoryCache()
  });
  
export default function BoatPage({ location }) {
  
    const params = new URLSearchParams(location.search);
    const id = params.get('oga_no');
    const home = `${location.origin}/browse_the_register/browse_the_register.html`;

    const [b] = useAxios(
      `https://ogauk.github.io/boatregister/page-data/boat/${id}/page-data.json`
    )
  
    const [p] = useAxios(
      `https://ogauk.github.io/boatregister/pickers.json`
    )
  
    useEffect(() => {
      if (b.data) {
         document.title = `${b.data.result.pageContext.boat.name} (${b.data.result.pageContext.boat.oga_no})`;
      }
    });
  
    if (b.loading || p.loading) return <p>Loading...</p>
    if (b.error) {
        if (id) {
            return (<div>
                Sorry, we had a problem getting the data for
                the boat with OGA number {id}
                <p>Please try searching on the <a href={home}>Main Page</a></p>
                </div>);
        } else {
            return (<div>
                If you were looking for a specific boat and know its OGA Number,
                you can add ?oga_no=1 or any other number to the url.
                <p>Otherwise try the <a href={home}>Main Page</a></p>
                </div>);
        }
    }
    if(p.error) {
      if (b.data.result.pageContext.pickers) {
        p.data = b.data.result.pageContext.pickers;
      } else {
        p.data = {};
      }
    }
  
    const boat = b.data.result.pageContext.boat;
    const pickers = p.data;
  
    console.log('boat', id, location);
    console.log('boat referrer', document.referrer);
  

    return (
    <ApolloProvider client={client}>
        <BoatWrapper
        boat={boat}
        pickers={pickers}
        link={Link}
        home={home}
        absolute={location.href}
    />
    </ApolloProvider>
  );

  }