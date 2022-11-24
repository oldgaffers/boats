import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from './loginbutton';
import CreateBoatButton from './createboatbutton';

export default function BoatRegisterIntro() {
  const { user } = useAuth0();
  let editor = false;
  if (user) {
    const roles = user['https://oga.org.uk/roles'];
    editor = roles && roles.includes('editor');
  }

  return (
    <Paper>
      <Grid container direction="row" alignItems="flex-start">
        <Grid item xs={8} >
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
            Know about a boat and can't find it here? Click the 'Add a boat' button.
          </Typography>
          <Typography variant="body1">
            Members can use the register to advertise their boat for sale. The
            first step is to make sure the boat is on the register.
            Boats for sale are all here, but you can see only the boats for sale on the&nbsp;
            <a href='/boat_register/boats_for_sale/index.html'>Boats For Sale</a> page.
          </Typography>
        </Grid>
        <Grid item xs={2} >
          <CreateBoatButton />
        </Grid>
        <Grid item xs={2} >
          <LoginButton />
          {editor ? (<Box sx={{ marginTop: '1rem' }}>
            <Stack spacing={1}>
            <Button
              size="small"
              variant="contained"
              color='primary'
              href="/boat_register/yearbook/"
            >Yearbook</Button>
            </Stack>
          </Box>) : ''}
        </Grid>
      </Grid>
    </Paper>
  );
}