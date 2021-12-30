import React from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useAuth0 } from "@auth0/auth0-react";
import BoatDetail from './boatdetail';
import BoatSummary from './boatsummary';
import BoatButtons from './boatbuttons';
import SmugMugGallery from './smugmuggallery';

export default function BoatWrapper({ boat }) {
  const { isLoading } = useAuth0();
  if (isLoading) {
       return <div>Loading ...</div>;
  }

  return (
    <Paper>
      <Container maxWidth="lg">
      <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={9}>
          <Typography variant="h3" component="h3">{boat.name}</Typography>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
          <Typography variant="h3" component="h3">{boat.year}</Typography>
      </Grid>
      <Grid item xs={12} md={8} lg={9}>
        <Paper>
          <SmugMugGallery albumKey={boat.image_key} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <BoatSummary boat={boat} />
      </Grid>
      <Grid item xs={12}>
        <BoatDetail boat={boat} />
      </Grid>
    </Grid>
    <BoatButtons  boat={boat}/>
    </Container>
    </Paper>
  );
};
