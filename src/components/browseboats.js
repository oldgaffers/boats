import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SearchAndFilterBoats from './searchandfilterboats';
import BoatCards from './boatcards';
import LeftMenu from './leftmenu';
import DrawerController from './drawercontroller';
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
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

function BrowseBoats({ dir='asc', window }) {
  const classes = useStyles();
  const [boatsPerPage, setBoatsPerPage] = useState(12);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState(dir);
  const [filters, setFilters] = useState(undefined);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <LeftMenu open={mobileOpen} onClose={handleDrawerToggle} container={container} />
      <Paper>
        <Grid container direction="row">
          <DrawerController onClick={handleDrawerToggle}/>
        </Grid>
        <Container>
        <Typography variant="subtitle2">
          We have hundreds of boats with pictures and many more waiting for
          pictures and more information.
        </Typography>
        <Typography variant="body1">
          Filter the list using the options below and then click the 'More' button
          for all the pictures and information we have for that boat.
          </Typography>
        <Typography variant="body1">
            Have a boat and can't find it here. Fill in our{' '}
            <a href="https://form.jotform.com/jfbcable/new-boat">form</a>
             &nbsp;and we will add it.
            </Typography>
        <Typography variant="body1">
            You can also use the form to suggest a boat whether you own it or
            not.
            </Typography>
        <Typography variant="body1">
            You'll can submit pictures, additions and corrections to boats or
            contact the owner from the boat's detail page.
            </Typography>
        <Typography variant="body1">
            Members can use the register to advertise their boat for sale. The
            first step is to make sure the boat is on the register.
        </Typography>
        <SearchAndFilterBoats
          onPageSizeChange={(_, a) => a && setBoatsPerPage(parseInt(a.name))}
          onSortFieldChange={(_, a) => a && setSortField(a.name)}
          onSortDirectionChange={(event) =>
            setSortDirection(event.target.checked ? 'desc' : 'asc')
          }
          onFilterChange={(f) => setFilters(f)}
        />
        </Container>
        <Divider />
        <BoatCards
          boatsPerPage={boatsPerPage}
          sortField={sortField}
          sortDirection={sortDirection}
          filters={filters}
        />
        <Divider />
        <p>Other great places to look for boats are:</p>
        <List>
          <ListItem>
            <a href="https://www.nationalhistoricships.org.uk">
              National Historic Ships
            </a>
          </ListItem>
          <ListItem>
            <a href="https://nmmc.co.uk/explore/databases/">NMM Cornwall</a>{' '}
            maintain a number of interesting databases including small boats,
            yacht designs
          </ListItem>
        </List>
      </Paper>
    </div>
  );
}

BrowseBoats.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};
export default BrowseBoats;
