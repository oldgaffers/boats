import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SearchAndFilterBoats from './searchandfilterboats';
import BoatCards from './boatcards';
import FleetIcon from './fleeticon';
import BoatIcon from './boaticon';
import AboutIcon from './abouticon';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function BrowseBoats({ window }) {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [boatsPerPage, setBoatsPerPage] = useState(12);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [where, setWhere] = useState(undefined);

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

  function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
  }

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        {['Boats', 'Designers', 'Builders', 'Fleets'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
            {[(<BoatIcon/>), (<Icon>person</Icon>), (<Icon>build</Icon>), (<FleetIcon/>)][index]}
            </ListItemIcon>
            <ListItemLink href={
              ["index.html","designers","builders","fleets"][index]
            }>
              <ListItemText primary={text} />
            </ListItemLink>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['About', 'Your Editors', 'Support', 'Tech'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {[(<AboutIcon/>), (<Icon>people_alt</Icon>), (<Icon>bug_report</Icon>), (<Icon>code</Icon>)][index]}
            </ListItemIcon>
            <ListItemLink href={
              ["about","editors","support","tech"][index]
            }>
              <ListItemText primary={text} />
            </ListItemLink>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <Container>
        <Grid container direction="row">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <Icon>menu</Icon>
          </IconButton>
          <h3>Welcome to the OGA Boat Register</h3>
        </Grid>
        <Typography variant="subtitle2">
          We have hundreds of boats with pictures and many more waiting for
          pictures and more information.
        </Typography>
        <Typography variant="body1">
          Filter the list using the options below and then click on 'Learn More'
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
      </Container>
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
