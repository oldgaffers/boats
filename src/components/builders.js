import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
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

function Builders({ window }) {
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
            We will bring you the ability to see all the Builders we have,
            their designs and more.
          </Typography>
          <Grid container>
            <Grid item>
              <Card>
                <CardActionArea>
                    <CardMedia
                      className={classes.cardMedia}
                      image="https://www.cornishcrabbers.co.uk/wp-content/themes/8wire/images/Crabber-Gold-logo.png"
                      title=""
                    />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                        Cornish Crabbers
                    </Typography>
                    <Typography
                      variant="body2"
                    >Stuff we know
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                  >
                    More..
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item>
              <Card>
                <CardActionArea>
                    <CardMedia
                      className={classes.cardMedia}
                      image="https://cornwallmarine.net/wp-content/sabai/File/files/l_4faf6ecf61e642911b27a00d992ae420.jpg"
                      title=""
                    />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                    Gaffers and Luggers
                    </Typography>
                    <Typography
                      variant="body2"
                    >Stuff we know.
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                  >
                    More..
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Paper>
    </div>
  );
}

export default Builders;
