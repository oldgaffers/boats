import React from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function DetailBar({ onChange, value, panes }) {
  return (
    <AppBar position="static" color="inherit" sx={{ paddingLeft: '3px', height: '3.2rem' }}>
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
