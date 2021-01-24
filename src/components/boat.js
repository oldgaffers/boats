import React, { useEffect } from 'react';
import BoatWrapper from './boatwrapper';
import useAxios from 'axios-hooks'
import { Link } from "@ogauk/link-router";
import { useQuery } from '@apollo/react-hooks';
import { query } from '../util/boatquery';

// gql or axios
function getBoat(b) {
  if (b.data.boat) {
    return b.data.boat[0];
  }
  return b.data.result.pageContext.boat;
}

export default function Boat({location}) {

  const params = new URLSearchParams(location.search);
  const oga_no = params.get('oga_no');
  
  /*
  const [b] = useAxios(
    `https://ogauk.github.io/boatregister/page-data/boat/${oga_no}/page-data.json`
  )
  */
  const b = useQuery(query(oga_no));

  useEffect(() => {
    if (b.data) {
      const boat = getBoat(b);
      document.title = `${boat.name} (${boat.oga_no})`;
    }
  });

  if (b.loading) return <p>Loading...</p>
  if (b.error) {
      if (oga_no) {
          return (<div>
              Sorry, we had a problem getting the data for
              the boat with OGA number {oga_no}
              <p>Please try searching on the <a href={location.origin}>Main Page</a></p>
              </div>);
      } else {
          return (<div>
              If you were looking for a specific boat and know its OGA Number,
              you can add ?oga_no=1 or any other number to the url.
              <p>Otherwise try the <a href={location.origin}>Main Page</a></p>
              </div>);
      }
  }

  const boat = getBoat(b);
  return <BoatWrapper boat={boat} linkComponent={Link} location={location} />;
};

