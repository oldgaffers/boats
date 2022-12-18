import React from 'react';
import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import { useAuth0 } from "@auth0/auth0-react";
import { memberPredicate } from '../util/membership';

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

export default function YearbookBoats({ boats, members }) {
    // console.log('YearbookBoats', members, boats);

    const { user, isAuthenticated } = useAuth0();

    if (!isAuthenticated) {
        return (<div>Please log in to view this page</div>);
    }

    const roles = user['https://oga.org.uk/roles'] || [];
    if (!roles.includes('editor')) {
        return (<div>This pag is only useful to editors of the boat register</div>);
    }

    function ownerValueGetter({ value }) {
        const owningMembers = value.map((owner) => {
            return members.find((m) => memberPredicate(owner, m));
        });
        const lastNames = [...new Set(owningMembers.map((owner) => owner?.lastname))]?.filter((n) => n);
        const r = joinList(
            lastNames.map((ln) => {
                const fn = owningMembers.filter((o) => o?.lastname === ln)?.map((o) => `${o?.firstname}${o?.GDPR ? '' : '*'}`);
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

    const ybboats = boats.filter((b) => {
        let allowed = false;
        b.owners?.forEach((owner) => {
            let member;
            if (isNaN(owner)) {
                member = members.find((m) => `M${m.member}` === owner);
            } else {
                member = members.find((m) => m.id === owner);  
            }
            if (memberPredicate(owner, member)) {
                allowed = true;
            }
        });
        return allowed;
    }).map((b) => ({...b, id: b.oga_no }));

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
                <DataGrid
                    rows={ybboats}
                    columns={columns}
                    components={{ Toolbar: CustomToolbar }}
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
