import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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
        <Grid container direction="row">
          <DrawerController onClick={handleDrawerToggle} />
        </Grid>
        <Container>
          <Typography variant="body2">
            Members will be able to create fleets and add boats from the
            register to them.
          </Typography>
          <Typography variant="body2">
            This can be used to manage and record boats attending a rally, for
            tracking boats in the Round Britain '60 or for counting boats across
            the finish line in a race.
          </Typography>
        </Container>
        <Grid container direction="row">
          <Grid item xs={1 / 4}>&nbsp;</Grid>
          <Grid item xs={1 / 2}>
            <TableContainer component={Paper}>
              <Table className={classes.table} size="small" aria-label="">
                <TableHead>
                  <TableRow>
                    <TableCell>Crouch Rally 2014</TableCell>
                    <TableCell align="right">Name</TableCell>
                    <TableCell align="right">Skipper</TableCell>
                    <TableCell align="right">Finishing Position</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key="a">
                    <TableCell component="th" scope="row"></TableCell>
                    <TableCell align="right">Greensleeves II</TableCell>
                    <TableCell align="right">Roy Hart</TableCell>
                    <TableCell align="right">1</TableCell>
                  </TableRow>
                  <TableRow key="b">
                    <TableCell component="th" scope="row"></TableCell>
                    <TableCell align="right">Diamond</TableCell>
                    <TableCell align="right">Tony Judd</TableCell>
                    <TableCell align="right">2</TableCell>
                  </TableRow>
                  <TableRow key="c">
                    <TableCell component="th" scope="row"></TableCell>
                    <TableCell align="right">Jacinta</TableCell>
                    <TableCell align="right">Graham Jenkins</TableCell>
                    <TableCell align="right">3</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={1 / 4}></Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default Fleets;
