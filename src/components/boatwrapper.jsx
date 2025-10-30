import React from 'react';
import Typography from '@mui/material/Typography';
import BoatDetail from './boatdetail';
import BoatSummary from './boatsummary';
import BoatButtons from './boatbuttons';
import SmugMugGallery from './smugmuggallery';
import { Grid, Stack } from '@mui/material';

export default function BoatWrapper({ view='app', boat, location=null }) {
  return (
    <Stack>
      <Typography variant="h3" component="h3">{boat.name} ({boat.oga_no})</Typography>
      <Grid container>
        <Grid size={8}>
          <SmugMugGallery albumKey={boat.image_key} ogaNo={boat.oga_no} name={boat.name} />
        </Grid>
        <Grid size={4}>
          <BoatSummary boat={boat} location={location} />
        </Grid>
      </Grid>
      <BoatDetail view={view} boat={boat} />
      <BoatButtons boat={boat} location={location} />
    </Stack>
  );
};
