import React from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth0 } from "@auth0/auth0-react";

export default function LoginButton({ classes }) {
    const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

    if(isAuthenticated) {
        console.log(JSON.stringify(user));
        return (
        <Button className={classes.button} size="small"
            startIcon={<Avatar alt={user.name} src={user.picture} />}
            variant="contained"
            color="primary"
            onClick={() => logout({ returnTo: window.location.origin+window.location.pathname })}
        >
            Logout
        </Button>  
        );
    }
    return (
    <Tooltip title="Anyone can have a login. They aren't very useful yet.">
        <Button className={classes.button} size="small"
            startIcon={<AccountCircle/>}
            variant="contained"
            color="primary"
            onClick={() => loginWithRedirect()}
        >
            Login/Sign-up
        </Button>      
        </Tooltip>    
    );
}