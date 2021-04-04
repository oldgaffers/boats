import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import LeftMenu from './leftmenu';
import DrawerController from './drawercontroller';
import { makeStyles } from '@material-ui/core/styles';
import Iframe from 'react-iframe'
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  container: {
    height: '100vh',
    width: '100vw',
  },
  frame: {
    width: '100%',
    height: '100%',
  },
}));

function Fleets({ window }) {

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
        <Container className={classes.container}>
        <Iframe 
          className={classes.frame}
          frameBorder={0}
          url="https://oldgaffers.github.io/tasters/fleets.html"
        />
        </Container>
     </Paper>
    </div>
  );
}

export default Fleets