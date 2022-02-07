import React from 'react';
import EmailIcon from '@mui/icons-material/Email';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import ChangeViewer from './changeviewer';
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { useAuth0 } from "@auth0/auth0-react";
import { gql, useLazyQuery } from '@apollo/client';

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
  if(['spar_material'].includes(key)) {
    return value;
  }
  if(['beam'].includes(key)) {
    return value;
  }
  return `"${value}"`;
}

const mutation = (changes) => `mutation updateBoat(
  $id: uuid = "") {
  update_boat(where: {id: {_eq: $id}}, _set: {
    ${
      changes.map(({ key, value }) => key + ': ' + renderValue(key, value)).join(', ')
    }
  })
  {
    affected_rows
  }
}`;

export default function ProcessUpdates() {
  const { user, isAuthenticated } = useAuth0();
  let roles = [];
  if (isAuthenticated) {
      roles = user['https://oga.org.uk/roles'] || [];
  }
  if(document.referrer.includes('localhost')) { roles.push('editor')}
  const [getPending, pd] = useLazyQuery( query ); 
  if (!pd.called) {
    getPending();
    return <CircularProgress />;
  }
  if (pd.loading) {
    return <CircularProgress />;
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
            // console.log(cellValues);
            const handleChangeViewerClose = () => {
                console.log('handleChangeViewerClose');
                const { id, field } = cellValues;
                cellValues.api.commitCellChange({ id, field, value: 'boo'});
                cellValues.api.setCellMode(id, field, 'view');
            };
            const change = cellValues.row.data;
            const oldKeys = Object.keys(change.old);
            const different = Object.keys(change.new).filter((key) => {
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
              console.log(params);
              console.log('mutation', mutation([{key: 'spar_material', value: 'wood'}]));
            }}
          />,      
        ]
    }
  ];

  return (
    <div style={{ height: 350, width: '100%' }}>
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
      </div>
  );
}
