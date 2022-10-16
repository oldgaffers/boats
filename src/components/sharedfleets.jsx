import React from 'react';
import SimpleFleetView from './simplefleetview';

export default function SharedFleets() {
  return (
    <SimpleFleetView filters={{ public: true }} />
  );
}
