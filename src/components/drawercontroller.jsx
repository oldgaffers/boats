import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import { makeStyles } from '@mui/styles';

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