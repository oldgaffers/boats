import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import SearchAndFilterBoats from './searchandfilterboats';
import BoatCards from './boatcards';
import BoatsForSaleIntro from './boatsforsaleintro';
import BoatRegisterIntro from './boatregisterintro';

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

function Intro({boatsForSale}) {
  if (boatsForSale) {
    return (<BoatsForSaleIntro/>)
  }
  return (<BoatRegisterIntro/>);
}

export function makeBoatNameList(boat) {
  if (!boat) {
    return [];
  }
  const currentBoatNames = boat.map((b) => (b.name));
  const previousBoatNames = boat.map((b) => b.previous_names).flat();
  const setOfBoats = new Set([...currentBoatNames, ...previousBoatNames]);
  const allBoatNames = [...setOfBoats].filter((name) => name);
  allBoatNames.sort((a, b) => (a.toLowerCase().localeCompare(b.toLowerCase())));
  if (allBoatNames[0] === '') allBoatNames.shift();
  return allBoatNames.map((n) => ({ name: n, __typename: 'boat' }));
}

function BrowseBoats({
  pickers,
  state,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onFilterChange,
  link,
  location
}) {
  const classes = useStyles();
  //const [mobileOpen, setMobileOpen] = useState(false);
  //const handleDrawerToggle = () => {
  //  setMobileOpen(!mobileOpen);
  //};
 
  pickers.boatNames = makeBoatNameList(pickers.boat);

  const blank = "_blank";

  const { boatsPerPage, sortField, sortDirection, filters } = state;

  const handlePageChange = ({ selectedBoats, pages, page }) => {
    console.log('handlePageChange', selectedBoats, pages, page);
    onPageChange(page);
  };

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
          <Intro boatsForSale={filters.sale} />
        <SearchAndFilterBoats
          sortField={sortField}
          sortDirection={sortDirection}
          boatsPerPage={boatsPerPage}
          filters={filters}
          onPageSizeChange={onPageSizeChange}
          onSortChange={onSortChange}
          onFilterChange={onFilterChange}
          pickers={pickers}
        />
        </Container>
        <Divider />
        <BoatCards
          state={state}
          onChangePage={handlePageChange}
          link={link}
          location={location}
        />
        <Divider />
        <Typography>
          Other great places to look for boats are:
        </Typography>
        <List>
          <ListItem>
            <Typography>
              <a target={blank} href="https://www.nationalhistoricships.org.uk">
                National Historic Ships
              </a>
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              <a target={blank} href="https://nmmc.co.uk/explore/databases/">NMM Cornwall</a>&nbsp;
              maintain a number of interesting databases including small boats and
              yacht designs
            </Typography>
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
