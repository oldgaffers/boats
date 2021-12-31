import React from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: { height: 'auto', padding: 0 },
}));

export default function DetailBar({ onChange, value, panes }) {
  const classes = useStyles();
  return (
    <AppBar position="static" color="inherit" classes={classes}>
        <Tabs
        onChange={onChange}
            value={value}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
        >
        { panes.map((pane, i) => (<Tab key={i} label={pane.title}/>))}
        </Tabs>
    </AppBar>
  );
}
