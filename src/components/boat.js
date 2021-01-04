/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect,  } from 'react';
import { Link, useParams, useLocation } from "react-router-dom";
import { BoatWrapper } from './boatwrapper';
// import { useQuery } from '@apollo/react-hooks';
// import { query } from '../util/boatquery';
// import { usePicklists } from '../util/picklists';
import useAxios from 'axios-hooks'

export default function Boat() {

  const { id } = useParams();
  const location = useLocation();

  // const boatData = useQuery(query(id));
  // const pickerData = usePicklists();

  const [b] = useAxios(
    `https://ogauk.github.io/boatregister/page-data/boat/${id}/page-data.json`
  )

  const [p] = useAxios(
    `https://ogauk.github.io/boatregister/pickers.json`
  )

  useEffect(() => {
    // if (boatData.data) {
    //    document.title = boatData.data.boat[0].name;
    // }
    if (b.data) {
       document.title = b.data.result.pageContext.boat.name;
    }
  });

if (b.loading || p.loading) return <p>Loading...</p>
if (b.error || p.error) return <p>Error!</p>

  // if (boatData.loading || pickerData.loading) return <p>Loading...</p>
  // if (boatData.error || pickerData.error) return <p>Error: (Boat)</p>;
  // const boat = boatData.data.boat[0];
  // const pickers = pickerData.data;

  const boat = b.data.result.pageContext.boat;
  //const pickers = data.result.pageContext.pickers;
  const pickers = p.data;

  console.log('Boat - location', location);
  const homeLocation = { ...location, pathname: '/' };
  console.log('Home - location', homeLocation);

  const link = `https://www.oga.org.uk/boat_register/browse_the_register/boat.html?oga_no=${boat.oga_no}`;
  
  return (
    <BoatWrapper
      boat={boat}
      pickers={pickers}
      link={Link}
      home={homeLocation}
      absolute={link}
    />
  );
}

