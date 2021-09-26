import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import clsx from 'clsx';
import ConditionalText from './conditionaltext';
import References from './references';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { useLocation } from "react-router-dom";
import { boatUrl } from '../util/rr';

function ReactFBLike({
  language='en_GB',
  version='v12.0',
  width,
  href,
  appId,
}) {

  useEffect(() => {
    const id = 'facebook-jssdk';
    if (document.getElementById(id)) return;
    const r = document.createElement('div');
    r.id = "fb-root";
    const body = document.getElementsByTagName('body')[0];
    body.insertBefore(r, body.childNodes[0]);
    const scripts = document.getElementsByTagName('script');
    const last = scripts[scripts.length - 1];
    const js = document.createElement('script');
    js.id = id;
    js.async = true;
    js.defer = true;
    js.crossOrigin = 'anonymous';
    js.nonce = 'u3igJ9S2';
    js.src = `//connect.facebook.net/${language}/sdk.js#xfbml=1&version=${version}&appId=${appId}`;
    last.parentNode.insertBefore(js, last);
  }, [appId, language, version]);
  return (
    <div
      className="fb-like" 
      data-href={href}
      data-width={width}
      data-layout="standard" 
      data-action="like" 
      data-size="small" 
      data-share="true">
      </div>     
    );
}

export default function BoatSummary({ classes, boat }) {
  const location = useLocation();
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const fillHeightPaper = clsx(classes.paper, classes.fillHeight);
  const href = boatUrl(boat.oga_no, location);
  function handleSnackBarClose() {
    setSnackBarOpen(false);
  }

  return (
    <Paper className={fillHeightPaper}>
    <Typography variant="h4" component="h4">Summary</Typography>
    <ConditionalText value={boat.oga_no} label="OGA no"/>
    <ConditionalText value={boat.mainsail_type} label="Mainsail"/>
    <ConditionalText value={boat.rigTypeByRigType && boat.rigTypeByRigType.name} label="Rig"/>
    <ConditionalText value={boat.home_port} label="Home port or other location"/>
    <ConditionalText 
      value={(boat.website)?(<a href={boat.website} rel='noopenner noreferrer' target='_blank'>click here</a>):undefined}
      label="Website"
    />
    <Box className="MuiTypography-body1">
      <div dangerouslySetInnerHTML={{ __html: boat.short_description }}></div>
    </Box>
    <ConditionalText
      label="T(H)CF"
      value={boat.handicap_data && boat.handicap_data.thcf && boat.handicap_data.thcf.toFixed(3)}
    />
    <References boat={boat}/>
    <div>
      <CopyToClipboard text={href} onCopy={() => setSnackBarOpen(true)}>
        <Button endIcon={<AssignmentIcon/>} size='small' variant='contained' className={classes.button} >
        Copy page url
        </Button>
      </CopyToClipboard>
        <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackBarOpen}
        autoHideDuration={2000}
        onClose={handleSnackBarClose}
        message="URL copied to clipboard."
        severity="success"
      />
    </div>
    <div>
      <ReactFBLike href={'https://oga.org.uk'+href} appId="644249802921642" />
    </div>
    </Paper>
  );
}
