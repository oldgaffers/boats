import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
  }));
  
  function DrawerController({ onClick }) {
    const classes = useStyles();
    return (
        <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={onClick}
        className={classes.menuButton}
        >
        <Icon>menu</Icon>
        </IconButton>
    );
  }
export default DrawerController