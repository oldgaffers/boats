import React from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth0 } from "@auth0/auth0-react";

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