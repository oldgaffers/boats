import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Card, CardMedia, Skeleton } from '@mui/material';
import { getBoatData, getThumb } from '../util/api';
import {CompactBoatCard} from './boatcard';

const galleryWanted = {
  length_on_deck: { label: 'Length', access: (b, k) => m2f(b?.handicap_data?.[k]) },
  year: { label: 'Year', access: (b, k) => b[k] },
};

function BoatCardImage({ albumKey, name }) {
  const [data, setData] = useState();

  const height = 220;

  useEffect(() => {
    if (!data) {
      getThumb(albumKey).then((r) => {
        setData(r);
      }).catch((e) => console.log(e));
    }
  }, [data, albumKey]);

  if (!data) {
    return <>
      <Skeleton variant='rounded' animation='wave' height={height} />
    </>
  }

  if (data.ThumbnailUrl) {
    return (<CardMedia sx={{ height }} image={data.ThumbnailUrl} title={name} />);
  }
  return `picture of ${name}`;
}

function BoatImage({ boat }) {
  const [data, setData] = useState();

  useEffect(() => {
    if (!data) {
      getBoatData(boat.oga_no).then((r) => {
        setData(r);
      }).catch((e) => console.log(e));
    }
  }, [data, boat.oga_no]);

  const boatdata = data?.result?.pageContext || { boat: { oga_no: boat.oga_no, name: '', loading: true } };

  return <Card sx={{ width: 300 }}>
  <BoatCardImage albumKey={boatdata.boat.image_key} name={boat.name} />
  <p></p>
  </Card>
}

export default function BoatGallery({ boats }) {

  return (
    <Grid container alignItems='stretch'>
      {boats.map((boat) => {
            return (
            <Grid item key={boat.oga_no}
            xs={12}
            sm={6}
            md={3}
            lg={3}
            xl={3}
            >
              <BoatImage boat={boat} />
            </Grid>
            );
          }
          )
          }
  </Grid>);
}
