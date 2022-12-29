import React from 'react';
import Button from '@mui/material/Button';
import RoleRestricted from './rolerestrictedcomponent';

export default function YearbookButton() {
    return (
        <RoleRestricted role='editor'>
        <Button
          size="small"
          variant="contained"
          color='primary'
          href="/boat_register/yearbook/"
        >Yearbook</Button>
      </RoleRestricted>
    );
}