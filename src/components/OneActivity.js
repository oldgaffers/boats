import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Button from "@material-ui/core/Button";
import DescriptionIcon from "@material-ui/icons/Description";
import BoatIcon from "./boaticon";

export default function OneActivity({ classes, onCancel, onStart }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleClickCancel = () => {
    onCancel();
  };

  const handleClickStart = () => {
    onStart(selectedIndex);
  };

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
            <ListItemText primary="Update the short and long descriptions" />
          </ListItem>
          <ListItem
          >
            <ListItemIcon>
              <BoatIcon />
            </ListItemIcon>
            <ListItemText primary="More options coming soon" />
          </ListItem>
        </List>
        <Box display="flex" justifyContent="flex-end">
          <Box m={1}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleClickCancel}
            >
              Cancel
            </Button>
          </Box>
          <Box m={1}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleClickStart}
            >
              Let's go
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
}
