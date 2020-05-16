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
  const [where, setWhere] = useState(undefined);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  function updateFilters(filters) {
    
    console.log(filters);
    const all = [
      { year: { _gte: filters.year.first } },
      { year: { _lte: filters.year.last } },
    ];
    if (filters.ogaNo) {
      all.push({ oga_no: { _eq: filters.ogaNo } });
    }
    if (filters['boat-name']) {
      all.push({
        _or: [
          { name: { _ilike: `${filters['boat-name']}%` } },
          { previous_names: { _contains: filters['boat-name'] } },
        ],
      });
    }
    if (filters['designer-name']) {
      all.push({
        designerByDesigner: { name: { _eq: filters['designer-name'] } },
      });
    }
    if (filters['builder-name']) {
      all.push({
        buildersByBuilder: { name: { _eq: filters['builder-name'] } },
      });
    }
    if (filters['rig-type']) {
      all.push({ rigTypeByRigType: { name: { _eq: filters['rig-type'] } } });
    }
    if (filters['mainsail-type']) {
      all.push({ sail_type: { name: { _eq: filters['mainsail-type'] } } });
    }
    if (filters['generic-type']) {
      all.push({
        genericTypeByGenericType: { name: { _eq: filters['generic-type'] } },
      });
    }
    if (filters['design-class']) {
      all.push({
        designClassByDesignClass: { name: { _eq: filters['design-class'] } },
      });
    }
    if (filters['construction-material']) {
      all.push({
        constructionMaterialByConstructionMaterial: {
          name: { _eq: filters['construction-material'] },
        },
      });
    }
    if (!filters['nopics']) {
      all.push({ image_key: { _is_null: false } });
    }
    if (filters['sale']) {
      all.push({ for_sale_state: { text: { _eq: 'for_sale' } } });
    }
    console.log('filters', all);
    setWhere({ _and: all });
  }

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
            <a href="https://form.jotform.com/jfbcable/new-boat">form</a> and we
            will add it.
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
          onFilterChange={updateFilters}
        />
        </Container>
        <Divider />
        <BoatCards
          boatsPerPage={boatsPerPage}
          sortField={sortField}
          sortDirection={sortDirection}
          where={where}
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
