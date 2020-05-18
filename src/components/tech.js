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
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
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
        <Grid container direction="row">
          <Grid className={classes.content} item xs={12}>
            <Iframe frameBorder={false} url="https://oldgaffers.github.io/tech.html" height="100%" width="100%" />
          </Grid>
        </Grid>
     </Paper>
    </div>
  );
}

export default Tech