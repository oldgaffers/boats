import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Fleets } from './fleetview';

export default function SharedFleets() {
  const { user } = useAuth0();
  const id = user?.["https://oga.org.uk/id"];

  if (!id) {
    return '';
  }

  return (
    <Fleets filter={{ public: true}}/>
  );
}
