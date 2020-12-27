/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import { BoatWrapper, queryString } from './boatwrapper';

export default function Boat() {
  return (
    <BoatWrapper
      boat={data.register.boat[0]}
      pickers={pickers}
      link={Link}
      home={home}
      absolute={absolute}
    />
  );
}
