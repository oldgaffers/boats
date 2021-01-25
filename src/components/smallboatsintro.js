import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

export default function SmallBoatsIntro() {
    return (
        <Paper>
        <Typography variant="body1">
          Browse our newest feature - just the  dayboats and dinghies.
          All are on the main register too.
        </Typography>
        <Typography variant="body1">
          Filter the list using the options below, and then click the 'More' button
          to see all the pictures and information we have for that boat.
          </Typography>
        <Typography variant="body1">
            Have a boat and can't find it here? Fill in our{' '}
            <a href="https://form.jotform.com/jfbcable/new-boat">form</a>
             &nbsp;and we will add it.
            </Typography>
        <Typography variant="body1">
            You can also use the form to suggest a boat whether you own it or
            not.
            </Typography>
        <Typography variant="body1">
            You can submit pictures, additions, and corrections to boats, or
            contact the owner from the boat's detail page.
            </Typography>
        <Typography variant="body1">
            Members can use the register to advertise their boat for sale. The
            first step is to make sure the boat is on the register.
        </Typography>
        </Paper>
    );
}