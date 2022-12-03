import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Typography from "@mui/material/Typography";

export default function RoleRestricted({ role, children, hide=true }) {
    const { user, isAuthenticated } = useAuth0();
    console.log('RoleRestricted', children);
    if (!isAuthenticated) {
        if (hide) {
            return '';
        }
        return (<Typography>This page is for {role} only. Please Login</Typography>);
    }

    const roles = (user?.['https://oga.org.uk/roles']) || [];
    if (!roles.includes(role)) {
        if (hide) {
            return '';
        }
        return (<Typography>This page is for {role} only.</Typography>);
    }

    return (<>{children}</>);
}