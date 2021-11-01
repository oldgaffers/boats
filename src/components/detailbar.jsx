import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: { height: 'auto', padding: 0 },
}));

export default function DetailBar({ onChange, value, panes }) {
  const classes = useStyles();
  return (
    <Tabs
        onChange={onChange}
            value={value}
            indicatorColor="primary"
            textColor="primary"
            scrollable
        >
        { panes.map((pane, i) => (<Tab key={i} label={pane.title}/>))}
    </Tabs>
  );
}
