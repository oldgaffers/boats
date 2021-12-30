import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import DescriptionIcon from "@mui/icons-material/Description";
import TextField from "@mui/material/TextField";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import BoatIcon from "./boaticon";

export default function OneActivity({ classes, onCancel, onStart, onEmailChange }) {
  const [email, setEmail] = useState('');

  const handleListItemClick = (event, index) => {
    onStart(index);
  };

  const handleEmailChange = (e) => {
    if(e.target.reportValidity()) {
      setEmail(e.target.value);
      onEmailChange(e.target.value);
    } else {
      console.log('invalid email');
    }
  };

  return (
    <>
      <Paper className={classes.paper}>
        <Grid container direction='column' display="flex">
          <Grid m={1}>
            <Typography>An email address will let us discuss your suggestions</Typography>
          </Grid>
          <Grid m={1}>
            <TextField
                error={email === ''}
                onChange={handleEmailChange}
                autoFocus
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
            />
          </Grid>
          <Grid m={1}>
            <Typography component="h1" variant="h5" align="center">
              What do you want to do today?
            </Typography>
            <List>
              <ListItem
                button
                onClick={(event) => handleListItemClick(event, 0)}
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Update the short and long descriptions" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <BoatIcon />
                </ListItemIcon>
                <ListItemText primary="More options coming soon" />
              </ListItem>
            </List>
            </Grid>
          <Grid m={1}>
            <Button
              variant="outlined"
              color="primary"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}


