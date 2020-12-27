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

  const boatData = useQuery(query(id));

  const pickerData = useQuery(gql`
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
      if (boatData.data) {
          document.title = boatData.data.boat[0].name;
      }
  });

  if (boatData.loading || pickerData.loading) return <p>Loading...</p>
  if (boatData.error || pickerData.error) return <p>Error: (Boat)</p>;

  console.log('Boat - location', location);
  const homeLocation = { ...location, pathname: '/' };
  console.log('Home - location', homeLocation);

  const boat = boatData.data.boat[0];

  const link = `https://www.oga.org.uk/boat_register/browse_the_register/boat.html?oga_no=${boat.oga_no}`;
  
  return (
    <BoatWrapper
      boat={boat}
      pickers={pickerData.data}
      link={Link}
      home={homeLocation}
      absolute={link}
    />
  );
}

