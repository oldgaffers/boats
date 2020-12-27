/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect,  } from 'react';
import { Link, useParams, useLocation } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { BoatWrapper } from './boatwrapper';
import { query } from '../util/boatquery';

export default function Boat() {

  const { id } = useParams();
  const location = useLocation();

  const { loading, error, data } = useQuery(query(id));

  const { plLoading, plError, pickers } = useQuery(gql`
  query {
    design_class { name }
    generic_type { name }
    sail_type { name }
    rig_type { name }
    designer { name }
    construction_method { name }
    construction_material { name }
    spar_material { name }
    builder { name }
    hull_form { name }
  }`);

  useEffect(() => {
      if (data) {
          document.title = data.boat[0].name;
      }
  });

  if (loading || plLoading) return <p>Loading...</p>
  if (error || plError) return <p>Error: (Boat)</p>;

  console.log('Boat - location', location);
  const homeLocation = { ...location, pathname: '/' };
  console.log('Home - location', homeLocation);

  const boat = data.boat[0];

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

