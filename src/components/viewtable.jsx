import React, { useState, useEffect, useContext } from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import { useAuth0 } from "@auth0/auth0-react";
import { gql, useLazyQuery } from '@apollo/client';
import useAxios from 'axios-hooks';
import { TokenContext } from './TokenProvider';

const humanize = (str) => {
    var i, frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
}

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton />
            <GridToolbarExport csvOptions={{
                fileName: 'interested',
                delimiter: '\t',
                utf8WithBom: true,
            }} />
        </GridToolbarContainer>
    );
}

export default function ViewTable({ scope, table, topic }) {
    console.log('ExpressionsOfInterest', topic);
    const { user, isAuthenticated } = useAuth0();
    const [members, setMembers] = useState();
    const [data, setData] = useState();
    const accessToken = useContext(TokenContext);
    const [eoi, eoi_execute] = useAxios(
        {
            url: `https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/${scope}/${table}`,
            params: { topic },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        },
        { manual: true }
      )
    console.log('isAuthenticated', isAuthenticated);
    const [getMembers, m] = useLazyQuery(gql(`query members($members: [Int]!) {
        members(members: $members) {
          member id
          firstname lastname
        }
    }`));

    useEffect(() => {
        const getData = async () => {
            if (accessToken) {
                setData(await eoi_execute({ useCache: true }));
            }
        }
        getData();
    }, [accessToken, eoi_execute])
  
    if (!isAuthenticated) {
        return (<div>Please log in to view this page</div>);
    }

    if (m.loading) return <CircularProgress />;
    if (m.error) {
        console.log(m.error)
        return (<div>
        Sorry, we had a problem getting membership data
        </div>);
    }

    const roles = user['https://oga.org.uk/roles'] || [];
    if (!roles.includes(scope)) {
        return (<div>This page is only useful to editors of the boat register</div>);
    }

    if (eoi.loading) return <CircularProgress />;
    if (eoi.error) {
        console.log(eoi.error)
        return (<div>
            Sorry, we had a problem getting the expressions of interest
            </div>);
    }

    if (!data) {
        return <CircularProgress/>;
    }
    const rows = data.data.Items;
    if (m.data) {
        if (members) {
            console.log('members', members);
        } else {
            console.log('data', m.data);
            setMembers(m.data.members);
        }
    } else {
        const memberNumbers = [...new Set(rows.map((row) => row.member))];
        getMembers({ variables: { members: memberNumbers } });
    }
    const columns = [
        { field: 'lastname', headerName: 'Last', width: 90, },
        { field: 'firstname', headerName: 'First', width: 150, },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'member', headerName: 'Member No', width: 200 },
    ];
    rows.forEach((row) => {
        Object.keys(row.data).forEach((key) => {
            const label = humanize(key);
            columns.push({ field: key, headerName: label, description: label, width: 200 });
        })
    });

    const rows2 = rows.map((row) => {
        if (members) {
            return { ...row, ...row.data, ...members.find((member) => row.gold_id === member.id) };
        }
        return { ...row, ...row.data };
    });

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
                <DataGrid
                    rows={rows2}
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
