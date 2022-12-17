import React, { useEffect, useState } from 'react';
import { ApolloConsumer } from '@apollo/client';
import CircularProgress from "@mui/material/CircularProgress";
import BoatWrapper from './boatwrapper';
import { getBoatData } from './boatregisterposts';

export default function Boat({ location = { search: '?oga_no=' } }) {
  const params = new URLSearchParams(location.search);
  const ogaNo = params.get('oga_no') || '';
  const [data, setData] = useState();

  useEffect(() => {
    if (!data) {
      getBoatData(ogaNo).then((r) => {
        setData(r.data);
      }).catch((e) => console.log(e));
    }
  }, [data, ogaNo]);

  if (!data) return <CircularProgress />;

  if (ogaNo === '') {
    return (<div>
      <div>You've come to the boat detail viewer but we don't know what boat you wanted.</div>
      <div>If you are looking for boats for sale please visit <a href={location.origin + '/boat_register/boats_for_sale/'}>Boats for Sale</a></div>
      <div>If you are looking interested in trailerable boats please visit <a href={location.origin + '/boat_register/small_boats/'}>Small Boats</a></div>
      <div>To browse our full register please visit <a href={location.origin + '/boat_register/browse_the_register/'}>All Boats</a></div>
      Otherwise please visit our <a href={location.origin}>Home Page</a>
    </div>);
  }

  const { boat } = data?.result?.pageContext || { boat: { oga_no: ogaNo, name: '', loading: true } };

  document.title = `${boat.name} (${boat.oga_no})`;
  return (
    <ApolloConsumer>
      {client => <BoatWrapper client={client} location={location} boat={boat} />}
    </ApolloConsumer>
  );
};

