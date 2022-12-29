import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export default function SmallBoatsIntro() {
  return (
    <Grid container direction="row" alignItems="flex-start">
      <Grid item xs={8} >
        <Typography variant="body1">
          Browse just the dayboats and dinghies.
          All are on the main register too.
        </Typography>
        <Typography variant="body1">
          Filter the list using the options below, and then click the 'More' button
          to see all the pictures and information we have for that boat.
        </Typography>
        <Typography variant="body1">
          Know about a boat and can't find it here? Fill in our Form
        </Typography>
        <Typography variant="body1">
          You can submit pictures, additions, and corrections to boats, or
          contact the owner from the boat's detail page.
        </Typography>
        <Typography variant="body1">
          Members can use the register to advertise their boat for sale. The
          first step is to make sure the boat is on the register.
        </Typography>
      </Grid>
    </Grid>
  );
}