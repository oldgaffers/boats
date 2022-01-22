import React from 'react';
import Container from '@mui/material/Container';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';


const columns = [
    { field: 'oga_no', headerName: 'No', width: 90 },
    { field: 'name', headerName: 'Name', width: 130 },
];

const pending = [
    { oga_no: 315, name: 'Robinetta' },
];

export default function ProcessUpdates() {
    return (
    <Container sx={{maxHeight: '40vh'}}>
    <DataGrid
        rows={pending} columns={columns} 
        autoHeight={true} autoPageSize={true} 
        components={{ Toolbar: GridToolbar }}
        
    />
</Container>
);
}