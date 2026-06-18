import React from 'react';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';

export default function DrawerController({ onClick }) {
    return (
        <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={onClick}
        >
        <Icon>menu</Icon>
        </IconButton>
    );
}
