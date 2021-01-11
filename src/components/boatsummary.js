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

export default function BoatSummary({ classes, boat, boatUrl }) {
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const fillHeightPaper = clsx(classes.paper, classes.fillHeight);

  function handleSnackBarClose() {
    setSnackBarOpen(false);
  }

  return (
    <Paper className={fillHeightPaper}>
    <Typography variant="h4" component="h4">Details</Typography>
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
    <References boat={boat}/>
    <div>
      <CopyToClipboard text={boatUrl} onCopy={() => setSnackBarOpen(true)}>
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
      <ReactFBLike href={boatUrl} language="en_GB" appId="644249802921642" version="v2.12" />
    </div>
    </Paper>
  );
}