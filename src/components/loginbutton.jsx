import React from 'react';
import Button from '@material-ui/core/Button';
import { useAuth0 } from "@auth0/auth0-react";
import PersonIcon from '@material-ui/icons/Person';

export default function LoginButton({ classes, boat }) {
    const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

    if(isAuthenticated) {
        return (
            <Button className={classes.button} size="small"
            endIcon={<PersonIcon/>}
            variant="contained"
            color="primary"
            onClick={() => logout()}
        >
            Logout {user.name}
        </Button>      
        );
    }
    return (
        <div>
        <Button className={classes.button} size="small"
            endIcon={<PersonIcon/>}
            variant="contained"
            color="primary"
            onClick={() => loginWithRedirect()}
        >
            Login to see more
        </Button>      
        </div>
    );
}