import React from 'react';
import Typography from '@material-ui/core/Typography';

export default function BoatsForSaleIntro() {
    return (
        <>
        <Typography variant="body1">
        We have lots listed for sale! 
        Filter the list using the options below, 
        and then click the 'More' button to see all the pictures and information 
        we have for that boat.
            </Typography>
        <Typography variant="body1">
            Interested in a boat? Use the contact button on the boat's detail page and our editors
            will contact the owner for you.
            </Typography>
        <Typography variant="body1">
            Members can use the register to advertise their boat for sale. The
            first step is to make sure the boat is on the register.
        </Typography>
        </>
    );
}