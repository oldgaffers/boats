import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import LeftMenu from './leftmenu';
import DrawerController from './drawercontroller';
import { makeStyles } from '@mui/styles';
import Iframe from 'react-iframe'
import Container from '@mui/material/Container';
import { boatRegisterHome } from '../util/constants';

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
          url={`${boatRegisterHome}/tasters/fleets.html`}
        />
        </Container>
     </Paper>
    </div>
  );
}

export default Fleets