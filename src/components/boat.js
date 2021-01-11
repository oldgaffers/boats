import React, { useEffect,  } from 'react';
import { useParams, useLocation } from "react-router-dom";
import { BoatWrapper } from './boatwrapper';
import useAxios from 'axios-hooks'

export default function Boat() {

  const { id } = useParams();
  const location = useLocation();

  const [b] = useAxios(
    `https://ogauk.github.io/boatregister/page-data/boat/${id}/page-data.json`
  )

  useEffect(() => {
    if (b.data) {
       document.title = `${b.data.result.pageContext.boat.name} (${b.data.result.pageContext.boat.oga_no})`;
    }
  });

  if (b.loading) return <p>Loading...</p>
  if (b.error) return (<p>
    Sorry, we had a problem getting the data for
    the boat with OGA number {id}</p>)

  const boat = b.data.result.pageContext.boat;

  return (
    <BoatWrapper boat={boat} location={location} />
  );
}
