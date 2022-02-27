import React from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import { useAuth0 } from "@auth0/auth0-react";
import { gql, useQuery } from '@apollo/client';
import PhoneNumber from 'awesome-phonenumber';
import { memberPredicate } from '../util/membership';

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton />
            <GridToolbarExport csvOptions={{
                fileName: 'members',
                delimiter: '\t',
                utf8WithBom: true,
            }} />
        </GridToolbarContainer>
    );
}

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

function fettlePhone(n, area) {
    if (!n) {
        return undefined;
    }
    if (n.trim() === '') {
        return undefined;
    }
    if (n.startsWith('+')) {
        return PhoneNumber(n);
    } else if (n.startsWith('00')) {
        return PhoneNumber(n.replace('00', '+'));
    } else if (area === 'Dublin Bay') {
        const pn = PhoneNumber(n, 'IE');
        if (pn.isValid()) {
            return pn;            
        }
        return PhoneNumber(n, 'GB');
    } else if (area === 'Overseas') {
        return PhoneNumber(`+${n}`);
    }
    return PhoneNumber(n, 'GB');
}

function formatPhone(pn) {
    if (pn) {
        if (pn.isValid()) {
            if (pn.getCountryCode() === 44) {
                return pn.getNumber('national');
            }
            return pn.getNumber('international');
        }
    }
    return undefined;
}

function phoneGetter({ row }) {
    const mobile = formatPhone(fettlePhone(row.mobile, row.area));
    const landline = formatPhone(fettlePhone(row.telephone, row.area));
    const n = [];
    if (mobile) {
        n.push(mobile);
    }
    if (landline) {
        n.push(landline);
    }
    if (n.length > 0) {
        return n.join(' / ');
    }
    if (row.mobile === '' && row.telephone === '') {
        return '';
    }
    if (row.mobile.includes('@')) {
        return row.mobile;
    }
    if (row.telephone.includes('@')) {
        return row.telephone;
    }
    return `*** M: ${row.mobile} T: ${row.telephone} ***`;
}

function areaFormatter(params) {
    const { id, value, api } = params;
    const abbrev = {
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
    if (api.getRow(id).smallboats) {
        return `${abbrev}/sb`;
    }
    return abbrev;
}

export default function YearbookBoats() {
    const boatsResult = useQuery(gql`query boats { boat { id name oga_no ownerships } }`);
    const membersResult = useQuery(gql`query members { members { salutation firstname lastname member id GDPR smallboats status telephone mobile area town } }`);

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
                const p = o.find((os) => os.id === undefined && os.member === member && os.share === 64);
                if (p) {
                    console.log('Boat with owner with no GOLD ID', b.oga_no);
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
        { field: 'telephone', headerName: 'Telephone', width: 250, valueGetter: phoneGetter },
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
                    components={{ Toolbar: CustomToolbar }}
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
