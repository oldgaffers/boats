import React from 'react';
import EmailIcon from '@mui/icons-material/Email';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { useAuth0 } from "@auth0/auth0-react";
import { gql, useLazyQuery } from '@apollo/client';

const query = gql`query MyQuery { rbc60_notification { data id created_at } }`;

export default function EntryView() {
  const [getPending, getPendingResult] = useLazyQuery(query);
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return (<div>Please log in to view this page</div>);
  }

  const roles = user['https://oga.org.uk/roles'] || [];
  if (!roles.includes('editor')) {
    return (<div>This page is only useful to editors of the boat register</div>);
  }

  if (!getPendingResult.called) {
    getPending();
    return <CircularProgress />;
  }
  if (getPendingResult.loading) {
    return <CircularProgress />;
  }

  const columns = [
    { field: 'name', headerName: 'Boat Name', width: 150, valueGetter: (params) => params.row.boat_by_id.name },
    { field: 'oga_no', headerName: 'OGA No.', width: 90, valueGetter: (params) => params.row.boat_by_id.oga_no },
    { field: 'field', headerName: 'Change of', width: 150, valueFormatter: (params) => params.value.replace(/_/g, ' ') },
    {
      field: 'current', headerName: 'Existing', width: 200, valueFormatter: (params) => {
        if (params.value === 'null') return '';
        if (params.value == null) return undefined;
        return params.value;
      }
    },
    { field: 'proposed', headerName: 'Proposed', flex: 1, editable: true, renderEditCell: renderProposedEditInputCell },
    { field: 'status', headerName: 'Done', width: 50 },
    { field: 'originator', headerName: 'Contact', width: 200 },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => deletePendingItem({ variables: { row: params.row.id } })}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<EmailIcon />}
          label="Contact Originator"
          onClick={() => console.log(params)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<DoneIcon />}
          label="Commit"
          onClick={() => {
            const { boat, field, proposed } = params.row;
            let newData = proposed;
            if (jsonbFields.includes(field)) {
              newData = JSON.parse(proposed);
            }
            setUpdateInProgress(true);
            updateBoat({ variables: { id: boat, change: { [field]: newData, update_id: params.row.uuid } } });
          }}
        />,
        <GridActionsCellItem
          icon={<CancelIcon />}
          label="Reject"
          onClick={() => {
            updatePendingItem({ variables: { row: params.row.id, status: 'rejected' } })
          }}
        />,
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <DataGrid
          rows={getPendingResult.data.boat_pending_updates}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          autoHeight={true}
          initialState={{
            columns: {
              columnVisibilityModel: {
                current: false,
                originator: false,
              },
            },
          }}
        />
      </div>
    </div>
  );
}
