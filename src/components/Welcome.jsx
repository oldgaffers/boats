import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Box from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import LoginButton from './loginbutton';

export default function Welcome() {
    const { user } = useAuth0();
    if (!user) {
        return (
            <Tooltip title='If you are a member then please log-in to enable extra members only features.'>
                <Box><LoginButton /></Box>
            </Tooltip>
        );
    }
    if (user['https://oga.org.uk/id']) {
        return (
            <>
                <Typography variant="h6">Hi{' '}{user.name}.</Typography>
                <LoginButton />
            </>
        );
    }
    return (
        <Stack marginTop={2} spacing={1} maxWidth='50%'>
            <Typography>
                Sorry {user.given_name || ''}, your login is not associated with a member.
            </Typography>
            <Typography>
                When you create a login, the system matches your email address with the one we have on record.
                If you used the same one, the second time you log in, it almost always just works.
                If you use a different one we need to make the association for you.
            </Typography>
            <Typography>
               Head over to the members area to check your membership and link your account.
            </Typography>
            <Button variant="contained" href="/members_area/my_details/my_details.html">Check Membership</Button>
        </Stack>
    );
}
