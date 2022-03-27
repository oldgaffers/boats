import React from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useAuth0 } from "@auth0/auth0-react";
import { gql, useLazyQuery } from '@apollo/client';
import LoginButton from './loginbutton';

const query = gql`query rbc60 { rbc60_notification { data id created_at } }`;

export default function RBC60Entryies() {
    const [getEntries, getEntriesResult] = useLazyQuery(query);
    const { user, isAuthenticated } = useAuth0();

    if (!isAuthenticated) {
        return (<LoginButton/>);
        // return (<div>Please log in to view this page</div>);
    }

    const roles = user['https://oga.org.uk/roles'] || [];
    if (!roles.includes('editor')) {
        return (<div>This page is only useful to editors of the boat register</div>);
    }

    if (!getEntriesResult.called) {
        getEntries();
        return <CircularProgress />;
    }
    if (getEntriesResult.loading) {
        return <CircularProgress />;
    }

    console.log('data', getEntriesResult.data.rbc60_notification);

    const columns = [
        { field: 'boat', headerName: 'Boat Name', width: 150, valueGetter: (params) => params.row.data.boat.name },
        { field: 'oga_no', headerName: 'OGA No.', width: 90, valueGetter: (params) => params.row.data.boat.oga_no },
        { field: 'skipper', headerName: 'Skipper', width: 100, valueGetter: (params) => `${params.row.data.payment.payer.name.given_name} ${params.row.data.payment.payer.name.surname}` },
        { field: 'created_at', headerName: 'Submitted', width: 100, valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
        { field: 'data.rbc', headerName: 'Circumnavigating', width: 100, valueGetter: (params) => params.row.data.rbc, valueFormatter: (params) => params.value?'Yes':'No' },
        { field: 'ports', headerName: 'Ports', width: 300, valueGetter: (params) => params.row.data.port },
        { field: 'legs', headerName: 'Crewing', width: 300, valueGetter: (params) => JSON.stringify(params.row.data.leg) },
        { field: 'data.ecc', headerName: 'EC Cruise', width: 100, valueGetter: (params) => params.row.data.ecc, valueFormatter: (params) => params.value?'Yes':'' },
    ];

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
                <DataGrid
                    rows={getEntriesResult.data.rbc60_notification}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    autoHeight={true}
                    initialState={{
                        columns: {
                            columnVisibilityModel: {
                                current: false,
                                originator: false,
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}
