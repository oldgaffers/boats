import React from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import { useAuth0 } from "@auth0/auth0-react";
import { gql, useQuery } from '@apollo/client';
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

function currentOwners(ownerships) {
    let currentOwners = [];
    const { owners, current } = ownerships;
    if (current) {
        currentOwners.push(...current);
    }
    if (owners) {
        currentOwners.push(...owners.filter((o) => o.current));
    }
    return currentOwners;
}

function joinList(strings, sep, lastSep) {
    if (strings.length === 1) {
        return strings[0];
    }
    return strings.slice(0, -1).join(sep) + lastSep + strings.slice(-1);
}

export default function YearbookBoats() {
    const boatsResult = useQuery(gql`query boats { boat { id name oga_no ownerships } }`);
    const membersResult = useQuery(gql`query members { members { firstname lastname member id GDPR status } }`);

    const { user, isAuthenticated } = useAuth0();

    if (!isAuthenticated) {
        return (<div>Please log in to view this page</div>);
    }

    const roles = user['https://oga.org.uk/roles'] || [];
    if (!roles.includes('editor')) {
        return (<div>This pag is only useful to editors of the boat register</div>);
    }

    if (boatsResult.loading || membersResult.loading) {
        return <CircularProgress />;
    }

    if (boatsResult.error) {
        return (<div>{JSON.stringify(boatsResult.error)}</div>);
    }

    if (membersResult.error) {
        return (<div>{JSON.stringify(membersResult.error)}</div>);
    }

    const { members } = membersResult.data;
    const { boat } = boatsResult.data;

    function ownerValueGetter({ value }) {
        let co = currentOwners(value);
        const owningMembers = co.map((owner) => ({ ...owner, ...members.find((m) => memberPredicate(owner.id, m)) }));
        // const owningMembers = co.map((owner) => ({ ...owner, ...members.find((m) => owner.id === m.id) }));
        const lastNames = [...new Set(owningMembers.map((owner) => owner.lastname))].filter((n) => n);
        const r = joinList(
            lastNames.map((ln) => {
                const fn = owningMembers.filter((o) => o.lastname === ln).map((o) => `${o.firstname}${o.GDPR ? '' : '*'}`);
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
        { field: 'ownerships', headerName: 'Owner', flex: 1, valueGetter: ownerValueGetter },
    ];

    const ybboats = boat.filter((b) => {
        let allowed = false;
        if (b.ownerships) {
            const co = currentOwners(b.ownerships);
            members.forEach((member) => {
                co.forEach((owner) => {
                    if (memberPredicate(owner.id, member)) {
                        allowed = true;
                    }
                });
            });
        }
        return allowed;
    });

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
                            sortModel: [{ field: 'name', sort: 'asc' }, { field: 'oga_no', sort: 'asc' }],
                        },
                    }}
                />
            </div>
        </div>
    );
}
