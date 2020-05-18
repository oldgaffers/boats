import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import LeftMenu from './leftmenu';
import DrawerController from './drawercontroller';
import { makeStyles } from '@material-ui/core/styles';
import Iframe from 'react-iframe'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  frame: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 0,
  },
}));

function Tech({ window }) {

  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <LeftMenu
        open={mobileOpen}
        onClose={handleDrawerToggle}
        container={container}
      />
      <Paper>
        <Grid className={classes.root} container direction="row">
          <DrawerController onClick={handleDrawerToggle} />
        </Grid>
          <div className={classes.container}>
            <Iframe className={classes.frame} frameBorder={false} url="https://oldgaffers.github.io/tech.html" />
          </div>
     </Paper>
    </div>
  );
}

export default Tech