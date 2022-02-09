import React, { useEffect, useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import ChangeViewer from './changeviewer';
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { useAuth0 } from "@auth0/auth0-react";
import { gql, useLazyQuery, useMutation } from '@apollo/client';

const query = gql`query MyQuery {
  boat_pending_updates {
    boat
    data
    id
    originator
    uuid
    boat_by_id {
      name
      oga_no
    }
  }
}`;

/* TODO create minimal mutation, remembering enums and numbers are not quoted
*/

const renderValue = (key, value) => {
  
  if(['handicap_data'].includes(key)) {
    return JSON.stringify(JSON.stringify(value));
  }
  if(['spar_material'].includes(key)) {
    return value;
  }
  if(['beam','length_on_deck'].includes(key)) {
    return value;
  }
  return `"${value}"`;
}

const mutation = (changes) => {
  console.log('mutation changes', changes);
  if (!changes) {
    return gql`mutation updateBoat($id: uuid) {
      update_boat(
        where: {id: {_eq: $id}}
      )
      {
        affected_rows
      }
    }`
  }
  const r = `mutation updateBoat($id: uuid!, $row_to_delete: Int!) {
    update_boat(
      where: {id: {_eq: $id}},
      _set: {
        ${
          changes.map(({ key, value }) => key + ': ' + renderValue(key, value)).join(', ')
        }
      }
    )
    {
      affected_rows
    }
    delete_boat_pending_updates_by_pk(id: $row_to_delete) {
      id
    }
  }`
  console.log('mutation', r);
  return gql(r);
};

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
  return keys.map((key) => ({ key, value: change.new[key]}));
}

export default function ProcessUpdates() {
  const [change, setChange] = useState();
  const [updateBoat, updateBoatResult] = useMutation(mutation(change ? change.differences : undefined));
  const [getPending, pd] = useLazyQuery( query ); 
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (change && change.boat && !updateBoatResult.called) {
      const params = { variables: { id: change.boat, row_to_delete: change.row_to_delete }};
      console.log('updateBoat', params);
      updateBoat(params);
      setChange();
    }
  }, [change, updateBoat, updateBoatResult]);

  if (!isAuthenticated) {
    return (<div>Please log in to view this page</div>);
  }

  const roles = user['https://oga.org.uk/roles'] || [];
  if (!roles.includes('editor')) {
    return (<div>This pag is only useful to editors of the boat register</div>);
  }

  console.log('updateBoatResult',  updateBoatResult);

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
    { field: 'name', headerName: 'Boat Name', width: 90, valueGetter: (params) => params.row.boat_by_id.name },
    { field: 'oga_no', headerName: 'OGA No.', width: 90, valueGetter: (params) => params.row.boat_by_id.oga_no },
    { field: 'originator', headerName: 'Contact', width: 200 },
    { field: 'data', headerName: 'Change', flex: 1, editable: true,
        valueFormatter: (params) => {
            return 'double click to see the change';
        },
        renderEditCell: (cellValues) => {
            const handleChangeViewerClose = () => {
                console.log('handleChangeViewerClose');
                const { id, field } = cellValues;
                cellValues.api.commitCellChange({ id, field, value: 'boo'});
                cellValues.api.setCellMode(id, field, 'view');
            };
            const change = cellValues.row.data;
            const different = changedKeys(change);
            if (different.length === 0) {
              return (<Alert variant="filled" severity="info">
              No changes identified.
            </Alert>);
            }
            return (<ChangeViewer onClose={() => handleChangeViewerClose()} open={true} different={different} change={change}/>);
        }
    },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params) => [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => console.log(params)}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<EmailIcon />}
            label="Contact Originator"
            onClick={() => console.log(params)}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => console.log(params)}
          />,
          <GridActionsCellItem
            icon={<DoneIcon />}
            label="Commit"
            onClick={() => {
              setChange({
                differences: differences(params.row.data),
                boat: params.row.data.new.id,
                row_to_delete: params.row.id,
              });
            }}
          />,      
        ]
    }
  ];

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <DataGrid
          rows={pd.data.boat_pending_updates}
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
