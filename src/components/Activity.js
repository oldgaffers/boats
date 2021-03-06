import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
// import Button from "@material-ui/core/Button";
import DescriptionIcon from "@material-ui/icons/Description";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import FastForward from "@material-ui/icons/FastForward";
import BoatIcon from "./boaticon";
import FleetIcon from "./fleeticon";

export default function Activity({ classes, onCancel, onStart }) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleListItemClick = (event, index) => {
    //setSelectedIndex(index);
    onStart(index);
  };

  //const handleClickCancel = () => {
  //  onCancel();
  //};

  //const handleClickStart = () => {
  //  onStart(selectedIndex);
  //};

  return (
    <>
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h5" align="center">
          What do you want to do today?
        </Typography>
        <List>
          <ListItem
            button
            selected={selectedIndex === 0}
            onClick={(event) => handleListItemClick(event, 0)}
          >
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="Update the short and full descriptions" />
          </ListItem>
          <ListItem
            button
            selected={selectedIndex === 1}
            onClick={(event) => handleListItemClick(event, 1)}
          >
            <ListItemIcon>
              <BoatIcon />
            </ListItemIcon>
            <ListItemText primary="Update rig and basic dimensions" />
          </ListItem>
          <ListItem
            button
            selected={selectedIndex === 2}
            onClick={(event) => handleListItemClick(event, 2)}
          >
            <ListItemIcon>
              <FleetIcon />
            </ListItemIcon>
            <ListItemText primary="Create or update a handicap" />
          </ListItem>
          <ListItem
            button
            selected={selectedIndex === 3}
            onClick={(event) => handleListItemClick(event, 3)}
          >
            <ListItemIcon>
              <ContactMailIcon />
            </ListItemIcon>
            <ListItemText primary="Update ownership and/or for-sale information" />
          </ListItem>
          <ListItem
            button
            selected={selectedIndex === 4}
            onClick={(event) => handleListItemClick(event, 4)}
          >
            <ListItemIcon>
              <FastForward />
            </ListItemIcon>
            <ListItemText primary="Do a full review/update" />
          </ListItem>
        </List>
      </Paper>
    </>
  );
}
