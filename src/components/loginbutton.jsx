import React from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth0 } from "@auth0/auth0-react";
import { Typography } from '@mui/material';

export function SuggestLogin() {
    const { user } = useAuth0();
    if (!user) {
        return <>
        <Typography>This is the members area. Please log-in</Typography>
          <LoginButton/>
        </>;
    }
    if (user["https://oga.org.uk/id"]) {
        return <Typography>Welcome to the Members Area</Typography>;
    }
    return <Typography>
        Sorry, we can't associate your login with a member.
        If you are a member, please contact us to sort this out.
    </Typography>
}

export default function LoginButton({ label='Login/Sign-up', avatar=true }) {
    const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

    if(isAuthenticated) {
        return (
        <Button size="small"
            startIcon={avatar?<Avatar alt={user.name} src={user.picture} />:undefined}
            variant="contained"
            color="primary"
            onClick={() => logout({ returnTo: window.location.origin+window.location.pathname })}
        >
            Logout
        </Button>  
        );
    }
    return (
    <Tooltip title="Anyone can have a login. It's most useful for members of the association.">
        <Button size="small"
            startIcon={<AccountCircle/>}
            variant="contained"
            color="primary"
            onClick={() => loginWithRedirect()}
        >
            {label}
        </Button>      
        </Tooltip>    
    );
}