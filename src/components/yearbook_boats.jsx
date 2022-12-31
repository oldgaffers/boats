import React from 'react';
import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton />
            <GridToolbarExport csvOptions={{
                fileName: 'members_boats',
                delimiter: '\t',
                utf8WithBom: true,
            }} />
        </GridToolbarContainer>
    );
}

function joinList(strings, sep, lastSep) {
    if (strings.length === 1) {
        return strings[0];
    }
    return strings.slice(0, -1).join(sep) + lastSep + strings.slice(-1);
}

export default function YearbookBoats({ boats=[], components={ Toolbar: CustomToolbar } }) {

    function ownerValueGetter({ value }) {
        if (!value) {
            return '';
        }
        const lastNames = [...new Set(value.map((owner) => owner?.lastname))]?.filter((n) => n);
        const r = joinList(
            lastNames.map((ln) => {
                const fn = value.filter((o) => o?.lastname === ln)?.map((o) => `${o?.firstname}${o?.GDPR ? '' : '*'}`);
                const r = `${joinList(fn, ', ', ' & ')} ${ln}`;
                return r;
            }),
            ', ',
            ' & '
        );
        return r;
    }

    function renderBoat(params) {
        return (<Typography variant={'body2'} fontStyle={'italic'}>{params.value}</Typography>);
    }

    function boatFormatter(params) {
        return params.value;
    }

    const columns = [
        { field: 'name', headerName: 'BOAT', width: 150, valueFormatter: boatFormatter, renderCell: renderBoat },
        { field: 'oga_no', headerName: 'No.', width: 90 },
        { field: 'owners', headerName: 'Owner', flex: 1, valueGetter: ownerValueGetter },
    ];

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
                <DataGrid
                    getRowId={(row) => row.oga_no}
                    rows={boats}
                    columns={columns}
                    components={components}
                    autoHeight={true}
                    initialState={{
                        sorting: {
                            // sortModel: [{ field: 'name', sort: 'asc' }, { field: 'oga_no', sort: 'asc' }],
                            sortModel: [{ field: 'name', sort: 'asc' }],
                        },
                    }}
                />
            </div>
        </div>
    );
}
