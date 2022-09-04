import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function BoatsForSaleIntro() {
    return (
        <Paper>
        <Typography variant="body1">
        We have lots listed for sale! 
        Filter the list using the options below, 
        and then click the 'More' button to see all the pictures and information 
        we have for that boat.</Typography>
        <Typography variant="body1">
        Interested in a boat? Use the contact button on the boat's detail page and our editors
        will contact the owner for you.</Typography>
        <Typography variant="body1">
            Want to advertise your boat here? You need to be a member or a member of an
            affiliated organisation like the Dutch OGA.
            In the first instance send us an email at boatregister@oga.org.uk.
            If you want to join just to sell a boat, that's fine.
            We hope you will like us enough to stay.
        </Typography>
        <Typography variant="body1">
        Try our latest feature. Click the check box on the bottom right of some boats and then turn on the new 'Only My Marked Boats' switch to see your short-list.
        </Typography>
        </Paper>
    );
}