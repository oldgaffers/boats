import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

export default function BoatsForSaleIntro() {
    return (
        <Paper>
        <Typography variant="body1">
        <p>We have lots listed for sale! 
        Filter the list using the options below, 
        and then click the 'More' button to see all the pictures and information 
        we have for that boat.</p>
        <p>Interested in a boat? Use the contact button on the boat's detail page and our editors
        will contact the owner for you.</p>
        <p>Members can use the register to advertise their boat for sale. The
        first step is to make sure the boat is on the register.</p>
        <p>Try our latest feature. Click the check box on the bottom right of some boats and then turn on the new 'Only My Marked Boats' switch to see your short-list.</p>
        </Typography>
        </Paper>
    );
}