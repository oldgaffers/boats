import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import LeftMenu from './leftmenu';
import DrawerController from './drawercontroller';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '100%',
  },
  cardMediaSmall: {
    paddingTop: '56.25%',
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}));

function About({ window }) {

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
        <Grid container direction="row">
          <DrawerController onClick={handleDrawerToggle} />
        </Grid>
        <Container>
        <Typography>In the early 1970s John Scarlett, the first OGA Secretary, started collecting data on members' boats.
        The records have grown to include nearly 3,500 craft, forming a unique record. Mainly gaff rigged, old and new, workboats and yachts, the Register also contains classic bermudan yachts and motorboats. 
        Data have been stored electronically since the 1980s and in 2016 the OGA launched the register online. Whilst primarily a record of members boats the register has become an important historical record of working and leisure craft and we are happy to receive details about interesting boats regardless of their association with the OGA. 
        OGA Members can list boats 'For Sale' at no additional charge.
        </Typography>
        </Container>
      </Paper>
    </div>
  );
}



export default About