import React from 'react';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from '@material-ui/core/Icon';
import { makeStyles, useTheme } from '@material-ui/core/styles';
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

function LeftMenu({ open, onClose, container }) {
  const classes = useStyles();
  const theme = useTheme();

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
              {
                [
                  <BoatIcon />,
                  <Icon>person</Icon>,
                  <Icon>build</Icon>,
                  <FleetIcon />,
                ][index]
              }
            </ListItemIcon>
            <ListItemLink
              href={['/', '/designers', '/builders', '/fleets'][index]}
            >
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
              {
                [
                  <AboutIcon />,
                  <Icon>people_alt</Icon>,
                  <Icon>bug_report</Icon>,
                  <Icon>code</Icon>,
                ][index]
              }
            </ListItemIcon>
            <ListItemLink href={['about', 'editors', 'support', 'tech'][index]}>
              <ListItemText primary={text} />
            </ListItemLink>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={open}
          onClose={onClose}
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
  );
}

export default LeftMenu;
