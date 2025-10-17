import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth0 } from "@auth0/auth0-react";
import { memo } from 'react';

export default memo(function LoginButton({ label = 'Login/Sign-up', avatar = true }) {
    const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

    if (isAuthenticated) {
        return (
            <Button size="small"
                startIcon={avatar ? <Avatar alt={user.name} src={user.picture} /> : undefined}
                variant="contained"
                color="primary"
                onClick={() => logout({ returnTo: window.location.origin + window.location.pathname })}
            >
                Logout
            </Button>
        );
    }
    return (
        <Button size="small"
            startIcon={<AccountCircle />}
            variant="contained"
            color="primary"
            onClick={() => loginWithRedirect()}
        >
            {label}
        </Button>
    );
});