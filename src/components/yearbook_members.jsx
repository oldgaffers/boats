import React from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useAuth0 } from "@auth0/auth0-react";
import { gql, useQuery } from '@apollo/client';
import PhoneNumber from 'awesome-phonenumber';

function currentOwners(ownerships) {
    let currentOwners = [];
    if (ownerships) {
        const { owners, current } = ownerships;
        if (current) {
            currentOwners.push(...current);
        }
        if (owners) {
            currentOwners.push(...owners.filter((o) => o.current));
        }
    }
    return currentOwners;
}

function nameGetter({ row }) {
    return `${row.salutation} ${row.firstname}`;
}

function phone(n, area) {
    if (n.startsWith('+')) {
        return PhoneNumber(n);
    } else if (n.startsWith('00')) {
        return PhoneNumber(n.replace('00', '+'));
    } else if (area === 'Dublin Bay') {
        return PhoneNumber(n, 'IE');
    } else if (area === 'Overseas') {
        return PhoneNumber(`+${n}`);
    }
    return PhoneNumber(n, 'GB');
}

function phoneGetter({ row }) {
    let pn;
    if (row.mobile && row.mobile.trim() !== '') {
        pn = phone(row.mobile, row.area);
        if (pn.isValid()) {
            if (pn.getCountryCode() === 44) {
                return pn.getNumber('national');
            }
            return pn.getNumber('international');
        }
    }
    if (row.telephone && row.telephone.trim() !== '') {
        pn = phone(row.telephone, row.area);
        if (pn.isValid()) {
            if (pn.getCountryCode() === 44) {
                return pn.getNumber('national');
            }
            return pn.getNumber('international');
        }
    }
    if (pn) {
        // console.log('INVALID', row.mobile, row.telephone, row.area);
        return `${row.mobile} ${row.telephone}`
    }
    return '';
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

function areaFormatter({ value }) {
    return {
        'Bristol Channel': 'BC',
        'Dublin Bay': 'DB',
        'East Coast': 'EC',
        'North East': 'NE',
        'Northern Ireland': 'NI',
        'North Wales': 'NWa',
        'North West': 'NW',
        'Scotland': 'SC',
        'Solent': 'SO',
        'South West': 'SW',
        'Overseas': 'OS',
    }[value];
}

export default function YearbookBoats() {
    const boatsResult = useQuery(gql`query boats { boat { id name oga_no ownerships } }`);
    const membersResult = useQuery(gql`query members { members { salutation firstname lastname member id GDPR status telephone mobile area town } }`);

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

    const ownedBoats = boat.filter((b) => {
        const o = currentOwners(b.ownerships);
        if (o.length > 0) {
            return true
        }
        return false;
    });

    function boatGetter({ row }) {
        const { id, member } = row;
        const boats = ownedBoats.filter((b) => {
            const o = currentOwners(b.ownerships);
            if (o.length > 0) {
                const owned = o.find((os) => os.id === id);
                if (owned) {
                    return true
                }
                // a few ownership records are missing a GOLD ID
                const p = o.find((os) => os.member === member && os.share === 64);
                if (p) {
                    return true;
                }
                return false;
            }
            return false;
        });
        return boats.map((b) => b.name).sort().join(', ');
    }

    function renderBoat(params) {
        return (<Typography variant={'body2'} fontStyle={'italic'}>{params.value}</Typography>);
    }

    function boatFormatter(params) {
        return params.value;
    }

    function renderLastname(params) {
        return (<Typography variant={'body2'} fontWeight={'bold'}>{params.value}</Typography>);
    }

    function lastnameFormatter(params) {
        return params.value;
    }

    const columns = [
        { field: 'lastname', headerName: 'Name', width: 90, valueFormatter: lastnameFormatter, renderCell: renderLastname },
        { field: 'name', headerName: 'Name', width: 150, valueGetter: nameGetter },
        { field: 'member', headerName: 'No', width: 90 },
        { field: 'telephone', headerName: 'Telephone', width: 150, valueGetter: phoneGetter },
        { field: 'town', headerName: 'Town', width: 150 },
        { field: 'boat', headerName: 'Boat Name', flex: 1, valueGetter: boatGetter, valueFormatter: boatFormatter, renderCell: renderBoat },
        { field: 'area', headerName: 'Area', width: 90, valueFormatter: areaFormatter },
    ];

    const ybmembers = members.filter((m) => memberPredicate(m.id, m));

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
                <DataGrid
                    rows={ybmembers}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    autoHeight={true}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'lastname', sort: 'asc' }, { field: 'member', sort: 'asc' }, { field: 'id', sort: 'asc' }],
                        },
                    }}
                />
            </div>
        </div>
    );
}