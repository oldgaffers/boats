import React from 'react';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Iframe from 'react-iframe'
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  container: {
    height: '100vh',
    width: '100vw',
  },
  frame: {
    width: '100%',
    height: '100%',
  },
}));

function Builders({ window }) {

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />      
      <Paper>
        <Container className={classes.container}>
        <Iframe 
          className={classes.frame}
          frameBorder={0}
          url="https://oldgaffers.github.io/tasters/builders.html"
        />
        </Container>
     </Paper>
    </div>
  );
}

export default Builders