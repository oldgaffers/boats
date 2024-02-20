import React from 'react';
import Typography from '@mui/material/Typography';
import UpdateCrewingProfile from './updatecrewingprofile';

export default function BoatsToSailIntro() {
    return (
        <>
            <Typography variant="body1">
                Take a look at our newest feature. We have boats for hire by members and boat's
                whose owners may be able to offer crewing opportunities.
                Filter the list using the options below,
                and then click the 'More' button to see all the pictures and information
                we have for that boat.</Typography>
            <Typography variant="body1">
                Interested in a boat? Use the contact button and your message will reach the owner. Or click on the boat's website link.</Typography>
            <Typography variant="body1">
                Want to see your boat on this list? For now, contact the boat register editors and we will sort it.
            </Typography>
            <UpdateCrewingProfile/>
        </>
    );
}