import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import clsx from 'clsx';
import ConditionalText from './conditionaltext';
import ReactFBLike from 'react-fb-like';
import References from './references';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { boatUrl } from '../util/context';

export default function BoatSummary({ classes, boat, location }) {
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
      <ReactFBLike href={href} language="en_GB" appId="644249802921642" version="v2.12" />
    </div>
    </Paper>
  );
}
