
import { useAuth0 } from "@auth0/auth0-react";
import Typography from "@mui/material/Typography";

export function useRoleQuery(role) {
    const { user, isAuthenticated } = useAuth0();
    if (!isAuthenticated) {
        return false;
    }
    const roles = (user?.['https://oga.org.uk/roles']) || [];
    if (roles.includes(role)) {
        return true;
    }
    return true;
}

export default function RoleRestricted({
    role,
    children,
    hide = true,
    fallback = (<Typography>This page is for {role} only. Please Login</Typography>),
}) {
    const hasRole = useRoleQuery(role); 
    if (hasRole) {
        return (<>{children}</>);
    }
    if (hide) {
        return (<></>);
    }
    return fallback;
}