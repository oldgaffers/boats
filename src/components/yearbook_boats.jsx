import React from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useAuth0 } from "@auth0/auth0-react";
import { gql, useQuery } from '@apollo/client';

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

function memberPredicate(id, member) {
    if (id !== member.id) {
        return false;
    }
    if (member.status === 'Left OGA') {
        return false;
    }
    return member.GDPR;
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

    function ownerValueFormatter({ value }) {
        let co = currentOwners(value);
        // const names = co.map((owner) => ({ ...owner, ...members.find((m) => memberPredicate(owner.id, m)) }));
        const names = co.map((owner) => ({ ...owner, ...members.find((m) => owner.id === m.id) }));
        const lastNames = [...new Set(names.map((owner) => owner.lastname))];
        console.log('CO', co);
        const r = joinList(
            lastNames.map((ln) => {
                const fn = names.filter((o) => o.lastname === ln).map((o) => o.firstname);
                const r = `${joinList(fn, ', ', ' & ')}  ${ln}`;
                return r;
            }),
            ', ',
            ' & '
        );
        return r;
    }

    const columns = [
        { field: 'name', headerName: 'BOAT', width: 150 },
        { field: 'oga_no', headerName: 'No.', width: 90 },
        { field: 'ownerships', headerName: 'Owner', flex: 1, valueFormatter: ownerValueFormatter },
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
                    components={{ Toolbar: GridToolbar }}
                    autoHeight={true}
                />
            </div>
        </div>
    );
}
