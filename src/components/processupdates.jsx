import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import ChangeViewer from './changeviewer';
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

export default function ProcessUpdates() {
  const { user, isAuthenticated } = useAuth0();
  let roles = [];
  if (isAuthenticated) {
      roles = user['https://oga.org.uk/roles'] || [];
  }
  if(document.referrer.includes('localhost')) { roles.push('editor')}
  const [getPending, pd] = useLazyQuery( query ); 
  console.log(pd);
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
            console.log(cellValues);

            const handleChangeViewerClose = () => {
                console.log('handleChangeViewerClose');
                const { id, field } = cellValues;
                cellValues.api.commitCellChange({ id, field, value: 'boo'});
                cellValues.api.setCellMode(id, field, 'view');
            };
            
            return (<ChangeViewer onClose={() => handleChangeViewerClose()} open={true} change={cellValues.row.data}/>);
        }
    },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params) => [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={console.log(params)}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={console.log(params)}
          />,
          <GridActionsCellItem
            icon={<DoneIcon />}
            label="Commit"
            onClick={console.log(params)}
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
