import React from 'react';
import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import { useAuth0 } from "@auth0/auth0-react";
import { parsePhoneNumber } from 'awesome-phonenumber'

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
    return ownerships?.filter((o) => o.current);
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
        return parsePhoneNumber(n);
    } else if (n.startsWith('00')) {
        return parsePhoneNumber(n.replace('00', '+'));
    } else if (area === 'Dublin Bay') {
        const pn = parsePhoneNumber(n, { regionCode: 'IE' });
        if (pn.valid) {
            return pn;            
        }
        return parsePhoneNumber(n, { regionCode: 'GB' });
    } else if (area === 'Overseas') {
        return parsePhoneNumber(`+${n}`);
    }
    return parsePhoneNumber(n, { regionCode: 'GB' });
}

function formatPhone(pn) {
    if (pn) {
        if (pn.valid) {
            if (pn.countryCode === 44) {
                return pn.number.national;
            }
            return pn.number.international;
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

export default function YearbookMembers({ members, boats }) {
    // console.log('YearbookBoats', members, boats);

    const { user, isAuthenticated } = useAuth0();

    if (!isAuthenticated) {
        return (<div>Please log in to view this page</div>);
    }

    const roles = user['https://oga.org.uk/roles'] || [];
    if (!roles.includes('editor')) {
        return (<div>This page is only useful to editors of the boat register</div>);
    }

    function boatGetter({ row }) {
        const { id, member } = row;
        const theirBoats = boats.filter((b) => {
            const o = currentOwners(b?.ownerships || []);
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
        return theirBoats.map((b) => b.name).sort().join(', ');
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

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
                <DataGrid
                    rows={members}
                    columns={columns}
                    components={{ Toolbar: CustomToolbar }}
                    autoHeight={true}
                    initialState={{
                        sorting: {
                            // sortModel: [{ field: 'lastname', sort: 'asc' }, { field: 'member', sort: 'asc' }, { field: 'id', sort: 'asc' }],
                            sortModel: [{ field: 'lastname', sort: 'asc' }],
                        },
                    }}
                />
            </div>
        </div>
    );
}
