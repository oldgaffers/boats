/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect,  } from 'react';
import { Link, useParams, useLocation } from "react-router-dom";
import { BoatWrapper } from './boatwrapper';
import useAxios from 'axios-hooks'

export default function Boat() {

  const { id } = useParams();
  const location = useLocation();

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
  if (b.error) return (<p>
    Sorry, we had a problem getting the data for
    the boat with OGA number {id}</p>)
  if(p.error) {
    if (b.data.result.pageContext.pickers) {
      p.data = b.data.result.pageContext.pickers;
    } else {
      p.data = {};
    }
  }

  const boat = b.data.result.pageContext.boat;
  const pickers = p.data;

  const homeLocation = { ...location, pathname: '/' };

  return (
    <BoatWrapper
      boat={boat}
      pickers={pickers}
      link={Link}
      home={homeLocation}
      absolute={`https://www.oga.org.uk/boat_register/browse_the_register/boat.html?oga_no=${boat.oga_no}`}
    />
  );
}

