import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DescriptionIcon from "@material-ui/icons/Description";
import TextField from "@material-ui/core/TextField";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import BoatIcon from "./boaticon";
import { FullKeelIcon } from './HullTypeIcons';

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
        <Grid container direction='column' display="flex" justifyContent="flex-end">
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
              <ListItem>
                <ListItemIcon>
                  <FullKeelIcon />
                </ListItemIcon>
                <ListItemText primary="A Hull" />
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


