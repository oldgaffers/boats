import React, { useEffect, useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
// import ChangeViewer from './changeviewer';
// import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { useAuth0 } from "@auth0/auth0-react";
import { gql, useLazyQuery, useMutation } from '@apollo/client';

const query = gql`query MyQuery {
  boat_pending_updates {
    boat
    data
    field current proposed
    id
    originator
    uuid
    status
    boat_by_id {
      name
      oga_no
    }
  }
}`;

const UPDATE_BOAT = gql`mutation updateBoat($id: uuid!, $change: boat_set_input) {
  update_boat_by_pk(pk_columns: {id: $id}, _set: $change) {
      id
  }
}`;

const UPDATE_STATUS = gql`mutation updateStatus($row: Int!, $status: pending_status_enum!) {
  update_boat_pending_updates_by_pk(pk_columns: {id: $row}, _set: {status: $status})
  {
    status id
  }
}`;

const DELETE_PENDING = gql`mutation deleteStatus($row: Int!) {
  delete_boat_pending_updates_by_pk(id: $row) { id }
}`;

const changedKeys = (change) => {
  const oldKeys = Object.keys(change.old);
  return Object.keys(change.new).filter((key) => {
    if (oldKeys.includes(key)) {
        if (Array.isArray(change.old[key])) {
            if (change.old[key].length !== change.new[key].length) {
                return true;
            }
            if (change.old[key].length === 0) {
                return false;
            }
            return change.old[key] === change.new[key];
        } else if (typeof change.old[key] === 'object') {
            return JSON.stringify(change.old[key]) !== JSON.stringify(change.new[key]); // TODO nested
        } else if (change.old[key] === change.new[key]) {
            return false;
        }
    }
    return true;
  });
}

const differences = (change) => {
  const keys = changedKeys(change);
  return keys.map((field) => ({ field, current: change.old[field], proposed: change.new[field]}));
}

export default function ProcessUpdates() {
  const [updateBoat, updateBoatResult] = useMutation(UPDATE_BOAT);
  const [updatePendingItem, updatePendingItemResult] = useMutation(UPDATE_STATUS);
  const [deletePendingItem, deletePendingItemResult] = useMutation(DELETE_PENDING);
  const [getPending, pd] = useLazyQuery( query ); 
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    console.log('UP', updatePendingItemResult);
    if ((!updatePendingItemResult.error) && (!updatePendingItemResult.loading) && updatePendingItemResult.called) {
      const { data } = updatePendingItemResult;
      console.log('successfully updated the status of a row', data.update_boat_pending_updates_by_pk);
    }
  }, [updatePendingItemResult]);

  useEffect(() => {
    console.log('UB', updateBoatResult);
    if ((!updateBoatResult.error) && (!updateBoatResult.loading) && updateBoatResult.called) {
      console.log('successfully deleted a row');
    }
  }, [updateBoatResult]);

  useEffect(() => {
    console.log('DP', deletePendingItemResult);
    if ((!deletePendingItemResult.error) && (!deletePendingItemResult.loading) && deletePendingItemResult.called) {
      console.log('successfully deleted a row');
    }
  }, [deletePendingItemResult]);

  if (!isAuthenticated) {
    return (<div>Please log in to view this page</div>);
  }

  const roles = user['https://oga.org.uk/roles'] || [];
  if (!roles.includes('editor')) {
    return (<div>This pag is only useful to editors of the boat register</div>);
  }

  console.log('updateBoatResult',  updateBoatResult);
  console.log('updatePendingItemResult',  updatePendingItemResult);

  if (!pd.called) {
    getPending();
    return <CircularProgress />;
  }
  if (pd.loading) {
    return <CircularProgress />;
  }

  if(updateBoatResult.error) {
    console.log('updateBoatResult error');
  }

  if(updatePendingItemResult.error) {
    console.log('updatePendingItemResult error');
  }

  const handlePageChange = (page) => {
        console.log('handlePageChange', page);
  };

  const handlePageSizeChange = (pageSize) => {
        console.log('handlePageSizeChange', pageSize);
  }

  const handleEditCellCommit = (params) => {
        console.log('handleEditCellCommit', params);
  };

  const columns = [
    { field: 'name', headerName: 'Boat Name', width: 150, valueGetter: (params) => params.row.boat_by_id.name },
    { field: 'oga_no', headerName: 'OGA No.', width: 90, valueGetter: (params) => params.row.boat_by_id.oga_no },
    { field: 'originator', headerName: 'Contact', width: 200 },
    { field: 'field', headerName: 'Change of', width: 150, valueFormatter: (params) => params.value.replace(/_/g, ' ') },
    { field: 'current', headerName: 'Existing', width: 300, valueFormatter: (params) => {
      if (params.value === 'null') return '';
      if (params.value == null) return undefined;
      return params.value;
    } },
    { field: 'proposed', headerName: 'Proposed', flex: 1, editable: true },
    { field: 'status', headerName: 'Done', width: 50 },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params) => [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => deletePendingItem({ variables: { row: params.row.id }})}
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
              updateBoat({ variables: { id: boat, change: { [field]: proposed } } });
            }}
          />,      
          <GridActionsCellItem
            icon={<CancelIcon />}
            label="Reject"
            onClick={() => {
              updatePendingItem({ variables: { row: params.row.id, status: 'rejected' }})
            }}
          />,      
        ]
    }
  ];

  const data = [];
  pd.data.boat_pending_updates.forEach((update) => {
    if (update.data) {
      const d = differences(update.data);
      d.forEach(({ field, current, proposed }, index) => {
        data.push({
          ...update, field, current, proposed, id: `${update.id}-${index}`
        })
      });  
    } else {
      data.push(update);
    }
  });

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <DataGrid
          rows={data}
          columns={columns} 
          components={{ Toolbar: GridToolbar }}
          autoHeight={true}
          onPageChange={(page, details) => handlePageChange(page, details)}
          onPageSizeChange={(pageSize) => handlePageSizeChange(pageSize)}
          onCellEditCommit={(params) => handleEditCellCommit(params)}
        />
      </div>
    </div>
  );
}
