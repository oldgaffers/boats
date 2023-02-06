import React from 'react';
import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
// import { GridToolbarExport } from '@mui/x-data-grid';
import { parsePhoneNumber } from 'awesome-phonenumber'
import Contact from './contact';

/*
            <GridToolbarExport csvOptions={{
                fileName: 'members',
                delimiter: '\t',
                utf8WithBom: true,
            }} />
*/
function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton />
        </GridToolbarContainer>
    );
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

function areaAbbreviation(value) {
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
        'The Americas': 'AM',
        'Continental Europe': 'EU',
        'Rest of World': 'RW',
    }[value];
    return abbrev;
}
/*
function oldAreaFormatter(params) {
    const { id, value, api } = params;
    const abbrev = areaAbbreviation(value);
    if (api.getRow(id).smallboats) {
        return `${abbrev}/sb`;
    }
    return abbrev;
}
*/
function areaFormatter(params) {
    return areaAbbreviation(params.value);
}

// export default function YearbookMembers({ members=[], boats=[] }) {
export default function YearbookMembers({ members=[], boats=[], components={ Toolbar: CustomToolbar } }) {
    // console.log('YearbookBoats', members, boats);

    function boatGetter({ row }) {
        const { id } = row;
        const theirBoats = boats.filter((b) => b.owners?.find((o) => o?.id === id));
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

    function smallboatsFormatter(params) {
        return params.value?'✓':'✗';
    }

    const columns = [
        { field: 'lastname', headerName: 'Last Name', width: 90, valueFormatter: lastnameFormatter, renderCell: renderLastname },
        { field: 'name', headerName: 'Given Name', width: 130, valueGetter: nameGetter },
        { field: 'member', headerName: 'No', width: 90 },
        { field: 'telephone', headerName: 'Telephone', width: 200, valueGetter: phoneGetter },
        {
            field: 'url',
            headerName: 'Details',
            width: 150,
            renderCell: (params) => <Contact member={params.row.id}/>,
        },
        { field: 'town', headerName: 'Town', width: 120 },
        { field: 'boat', headerName: 'Boat Name', flex: 1, valueGetter: boatGetter, valueFormatter: boatFormatter, renderCell: renderBoat },
        { field: 'area', headerName: 'Main Area', width: 100, valueGetter: areaFormatter },
        { field: 'interests', headerName: 'Other Areas', width: 120,  },
        { field: 'smallboats', headerName: 'SB', valueFormatter: smallboatsFormatter },
    ];

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
                <DataGrid
                    rows={members}
                    columns={columns}
                    components={components}
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
