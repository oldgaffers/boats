import React from 'react';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';
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
            onClick={() => logout()}
        >
            Logout
        </Button>      
        );
    }
    return (
        <div>
        <Button className={classes.button} size="small"
            startIcon={<AccountCircle/>}
            variant="contained"
            color="primary"
            onClick={() => loginWithRedirect()}
        >
            Login/Sign-up
        </Button>      
        </div>
    );
}