import React from 'react';
import Typography from '@mui/material/Typography';

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
                Interested in a boat? Use the contact button and your message will reach the owner.
                Or click on the boat's website link.</Typography>
                <Typography variant="body1">
                Want to see your boat on this list? If your boat is on the register, then
                head over to the 'My Details' option on the 'Members Area' menu. If your boat isn't yet on
                the register, just click the 'Add a boat' button above.
            </Typography>
            <Typography variant="h6">Crewing Profiles</Typography>
            <Typography variant="body1">
                You can also create a profile for yourself, and be visible to OGA skippers looking for crew.
                If you are a member, you can do this over on the 'My Details' option on the 'Members Area' menu.
                We also plan to make this available to non-members. We're not quite ready yet to make this
                self-service. So,
                for now, send an email to the boat register editors.
            </Typography>
        </>
    );
}