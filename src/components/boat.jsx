import React, { useEffect, useState } from 'react';
import { ApolloConsumer } from '@apollo/client';
import CircularProgress from "@mui/material/CircularProgress";
import BoatWrapper from './boatwrapper';
import { getBoatData } from './boatregisterposts';
import { Typography } from '@mui/material';

function getOgaNo(location) {
  const params = new URLSearchParams(location.search);
  const qp = params.get('oga_no');
  if (qp) {
    return qp;
  }
  const path = location.pathname?.split('/') || ['boat', ''];
  const p = path.indexOf('boat') + 1;
  console.log('L', path, );
  if (Number(path[p]) !== 0) {
    return path[p];
  }
  return undefined;
}

export default function Boat({ location }) {
  const ogaNo = getOgaNo(location);
  const [data, setData] = useState();

  useEffect(() => {
    if (ogaNo && !data) {
      getBoatData(ogaNo).then((r) => {
        setData(r.data);
      }).catch((e) => console.log(e));
    }
  }, [data, ogaNo]);

  if (!ogaNo) {
    return <Typography>Nothing here, go back to the <a href="..">main page</a></Typography>;
  }

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

