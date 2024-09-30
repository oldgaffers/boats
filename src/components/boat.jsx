import React, { useEffect, useState } from 'react';
import { ApolloConsumer } from '@apollo/client';
import BoatWrapper from './boatwrapper';
import { getBoatData, getBoatLastModified } from '../util/api';

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
  const [lastModified, setLastModified] = useState();

  useEffect(() => {
    const get = async () => {
      if (ogaNo && !data) {
        const extra = undefined; // await getScopedData('public', 'crewing', { oga_no: ogaNo });
        const e = extra?.Items?.[0] || {};
        const r = await getBoatData(ogaNo);
        const d = r?.result?.pageContext?.boat;
        setData({ ...d, ...e });
      }  
    };
    get();
  }, [data, ogaNo]);
  
  useEffect(() => {
    const get = async () => {
      if (ogaNo && !lastModified) {
        const lmd = await getBoatLastModified(ogaNo);
        setLastModified(lmd);
      }  
    };
    get();
  }, [lastModified, ogaNo]);

  if (ogaNo === 0) {
    return <MissingOGANumber/>;
  }

  if (!data) {
    return '';
  }

  const boat = data || { boat: { oga_no: ogaNo, name: '', loading: true } };

  if (boat.show_handicap) {
    boat.handicap_data.checked = boat.show_handicap; // TODO
  }

  document.title = `${boat.name} (${boat.oga_no})`;

  return (
    <ApolloConsumer>
      {client => <BoatWrapper client={client} boat={boat} lastModified={lastModified} />}
    </ApolloConsumer>
  );

};

