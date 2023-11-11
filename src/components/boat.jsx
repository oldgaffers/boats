import React, { useEffect, useState } from 'react';
import { ApolloConsumer } from '@apollo/client';
import BoatWrapper from './boatwrapper';
import { getBoatData } from './boatregisterposts';

export function MissingOGANumber() {
  const origin = '';

  return (<div>
    <div>You've come to the boat detail viewer but we don't know what boat you wanted.</div>
    <div>If you are looking for boats for sale please visit <a href={origin + '/boat_register/boats_for_sale/'}>Boats for Sale</a></div>
    <div>If you are looking interested in trailerable boats please visit <a href={origin + '/boat_register/small_boats/'}>Small Boats</a></div>
    <div>To browse our full register please visit <a href={origin + '/boat_register/browse_the_register/'}>All Boats</a></div>
    Otherwise please visit our <a href={origin}>Home Page</a>
  </div>);
}

export default function Boat({ ogaNo }) {
  const [data, setData] = useState();

  useEffect(() => {
    if (ogaNo && !data) {
      getBoatData(ogaNo).then((r) => {
        setData(r);
      }).catch((e) => console.log(e));
    }
  }, [data, ogaNo]);

  if (ogaNo === 0) {
    return <MissingOGANumber/>;
  }

  if (!data) {
    return '';
  }

  const { boat } = data?.result?.pageContext || { boat: { oga_no: ogaNo, name: '', loading: true } };

  document.title = `${boat.name} (${boat.oga_no})`;

  return (
    <ApolloConsumer>
      {client => <BoatWrapper client={client} boat={boat} />}
    </ApolloConsumer>
  );

};

