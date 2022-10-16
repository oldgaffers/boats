import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import SimpleFleetView from './simplefleetview';

export default function MyFleets() {
  const { user } = useAuth0();
  return (
    <SimpleFleetView filters={{ owner_gold_id: user['https://oga.org.uk/id'] }} />
  );
}
