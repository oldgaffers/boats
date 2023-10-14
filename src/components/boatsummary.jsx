import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ConditionalText from './conditionaltext';
import References from './references';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { boatUrl } from '../util/rr';
import { HandicapNoDisplay } from './boatdetail';

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
    last?.parentNode?.insertBefore(js, last);
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

export function HandicapDisplay({ boat }) {
  let solentlabel;
  let label;
  if (boat.handicap_data.checked) {
    label = 'Checked T(H)CF';
    solentlabel = 'Checked Solent Rating';
  } else {
    label = 'Proposed T(H)CF';
    solentlabel = 'Proposed Solent Rating';
  }
  return <><ConditionalText label={label} value={boat.handicap_data?.thcf?.toFixed(3)} />
  <ConditionalText label={solentlabel} value={boat.handicap_data?.solent?.thcf?.toFixed(3)} />
  </>
}

export default function BoatSummary({ boat }) {
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const href = boatUrl(boat.oga_no);
  function handleSnackBarClose() {
    setSnackBarOpen(false);
  }

  return (
    <Paper sx={{height: "100%", paddingLeft: '0.5em', paddingRight: '0.5em'}}>
    <Typography variant="h4" component="h4">Summary</Typography>
    <ConditionalText value={boat.oga_no} label="OGA no"/>
    <ConditionalText value={boat.mainsail_type} label="Mainsail"/>
    <ConditionalText value={boat.rig_type} label="Rig"/>
    <ConditionalText value={boat.home_port} label="Home port or other location"/>
    <ConditionalText label="Website">
      <a href={boat.website} rel='noopenner noreferrer' target='_blank'>click here</a>
    </ConditionalText>
    <Box className="MuiTypography-body1">
      <div dangerouslySetInnerHTML={{ __html: boat.short_description }}></div>
    </Box>
    <HandicapNoDisplay/>
    <ConditionalText value={boat.previous_names} label="Previous name/s"/>
    <References boat={boat}/>
    <div>
      <CopyToClipboard text={window.location.href} onCopy={() => setSnackBarOpen(true)}>
        <Button endIcon={<AssignmentIcon/>} size='small' variant='contained'>
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
