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

export default function ExpressionsOfInterest({ topic }) {
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

    if (!isAuthenticated) {
        return (<div>Please log in to view this page</div>);
    }

    const roles = user['https://oga.org.uk/roles'] || [];
    if (!roles.includes('editor')) {
        return (<div>This pag is only useful to editors of the boat register</div>);
    }

    if (result.error) {
        return (<div>{JSON.stringify(result.error)}</div>);
    }

    const { eoi } = result.data;

    const columns = [
        { field: 'lastname', headerName: 'Name', width: 90,  },
        { field: 'name', headerName: 'Name', width: 150, },
        { field: 'member', headerName: 'No', width: 90 },
    ];

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
                <DataGrid
                    rows={eoi}
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
