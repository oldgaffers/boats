import React from 'react';
import { makeStyles } from "@mui/styles";
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import CreateBoatButton from './CreateBoat';
import LoginButton from './loginbutton';

export default function BoatRegisterIntro() {
  return (
    <Paper>
      <Grid container direction="row" alignItems="flex-start">
        <Grid item xs={10} >
        <Typography variant="body1">
          We have hundreds of boats with pictures, and more waiting for
          pictures and more information.
        </Typography>
        <Typography variant="body1">
          Filter the list using the options below, and then click the 'More' button
          to see the boat's details.
        </Typography>
        <Typography variant="body1">
          A boat's page has all the pictures and information we have for that boat.
          On the detail page 
          you can:
        </Typography>
        <List dense={true}>
        <ListItem>submit pictures, additions, and corrections to boats</ListItem>
        <ListItem>contact the owner</ListItem>
        <ListItem>contact the owner, or the boat register editors</ListItem>
        <ListItem>get a link to share the boat with friends or on other sites</ListItem>
        </List>
        <Typography variant="body1">
            Know about a boat and can't find it here? Fill in our
        </Typography>
        <CreateBoatButton/>
        <Typography variant="body1">
            Members can use the register to advertise their boat for sale. The
            first step is to make sure the boat is on the register.
        </Typography>
        </Grid>
        <Grid item xs={2} >
          <LoginButton/>
        </Grid>
      </Grid>
    </Paper>
    );
}