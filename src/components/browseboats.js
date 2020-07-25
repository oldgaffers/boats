import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation, useHistory } from 'react-router-dom';
import SearchAndFilterBoats from './searchandfilterboats';
import BoatCards from './boatcards';

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

function BrowseBoats({ window }) {
  const { state, search } = useLocation();
  const history = useHistory();
  const classes = useStyles();
  //const [mobileOpen, setMobileOpen] = useState(false);
  const params = new URLSearchParams(search);
  const options = params.get('options');
  //const handleDrawerToggle = () => {
  //  setMobileOpen(!mobileOpen);
  //};
 
  const handlePageSizeChange = (_, a) => {
    history.replace('/', { ...state, boatsPerPage: a });
    // setBoatsPerPage(a)
  };
  
  function setSortField(field) {
    history.replace('/', { ...state, sortField: field });
  }

  function setSortDirection(dir) {
    history.replace('/', { ...state, sortDirection: dir });
  }

  function setFilters(filters) {
    history.replace('/', { ...state, filters });
  }

  // const container = window !== undefined ? () => window().document.body : undefined;
  //filters: { year: { firstYear: 1800, lastYear: new Date().getFullYear() }},
  let filters = {}
  let config = state;
  if (config) {
    filters = config.filters;
  }
  if (options === 'forsale') {
    filters.sale = true;
    filters.nopics = true;
  }
  if (config) {
    config.filters = filters;
  } else {
    config = { 
      boatsPerPage: '12',
      sortField: 'name',
      sortDirection: 'asc',
      filters,    
     }
     history.replace('/', config);
  }

  console.log(config);

  console.log('BrowseBoats history', history);

  return (
    <div className={classes.root}>
      <CssBaseline />
      {/*
      <LeftMenu open={mobileOpen} onClose={handleDrawerToggle} container={container} />
      */}
      <Paper>
        {/*
        <Grid container direction="row">
          <DrawerController onClick={handleDrawerToggle}/>
        </Grid>
        */}
        <Container>
        <Typography variant="body1">
          We have hundreds of boats with pictures, and many more waiting for
          pictures and more information.
        </Typography>
        <Typography variant="body1">
          Filter the list using the options below, and then click the 'More' button
          to see all the pictures and information we have for that boat.
          </Typography>
        <Typography variant="body1">
            Have a boat and can't find it here? Fill in our{' '}
            <a href="https://form.jotform.com/jfbcable/new-boat">form</a>
             &nbsp;and we will add it.
            </Typography>
        <Typography variant="body1">
            You can also use the form to suggest a boat whether you own it or
            not.
            </Typography>
        <Typography variant="body1">
            You can submit pictures, additions, and corrections to boats, or
            contact the owner from the boat's detail page.
            </Typography>
        <Typography variant="body1">
            Members can use the register to advertise their boat for sale. The
            first step is to make sure the boat is on the register.
        </Typography>
        <SearchAndFilterBoats
          sortDirection={config.sortDirection}
          sortField={config.sortField}
          boatsPerPage={config.boatsPerPage}
          filters={config.filters}
          onPageSizeChange={handlePageSizeChange}
          onSortFieldChange={(field) => setSortField(field)}
          onSortDirectionChange={(event) =>
            setSortDirection(event.target.checked ? 'desc' : 'asc')
          }
          onFilterChange={(f) => setFilters(f)}
        />
        </Container>
        <Divider />
        <BoatCards
          boatsPerPage={parseInt(config.boatsPerPage)}
          sortField={config.sortField}
          sortDirection={config.sortDirection}
          filters={config.filters}
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
