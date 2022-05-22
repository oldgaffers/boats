import React, { useState } from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import { useAuth0 } from "@auth0/auth0-react";
import { gql, useQuery, useLazyQuery } from '@apollo/client';

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



export default function ExpressionsOfInterest({ topic }) {
    const [members, setMembers] = useState();
    const result = useQuery(gql`query eoi($topic: String!) {
        expression_of_interest(where: {topic: {_eq: $topic}}) {
          created_at
          data
          email
          gold_id
          id
          member
        }
      }`,
        {
            variables: { topic }
        });

    const { user, isAuthenticated } = useAuth0();

    const [getMembers, { loading, error, data }] = useLazyQuery(gql(`query members($members: [Int]!) {
        members(members: $members) {
          member id
          firstname lastname
        }
      }`));
    if (loading) return <p>Loading ...</p>;
    if (error) return `Error! ${error}`;

    if (!isAuthenticated) {
        return (<div>Please log in to view this page</div>);
    }

    const roles = user['https://oga.org.uk/roles'] || [];
    if (!roles.includes('editor')) {
        return (<div>This pag is only useful to editors of the boat register</div>);
    }

    if (result.loading) {
        return <CircularProgress />;
    }

    if (result.error) {
        return (<div>{JSON.stringify(result.error)}</div>);
    }
    const rows = result.data.expression_of_interest;
    console.log('row', rows[0]);
    if (data) {
        if (members) {
            console.log('members', members);
        } else {
            console.log('data', data);
            setMembers(data.members);
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
            columns.push({field: key, headerName: label, description: label, width: 200 });
        })
    });

    const rows2 = rows.map((row) => {
        return { ...row, ...row.data, ...members.find((member) => row.gold_id === member.id)};
    });
    console.log(rows2);
    return (
        <>
            <Typography variant='h5'>Expressions of interest for {topic}.</Typography>
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
        </>
    );
}
