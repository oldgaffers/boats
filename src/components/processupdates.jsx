import React from 'react';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import CheckIcon from '@mui/icons-material/Check';
// import IconButton from '@mui/material/IconButton';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { gql, useQuery } from '@apollo/client';
import ChangeViewer from './changeviewer';

/*
const PENDING_COUNT_QUERY = gql`
  query MyQuery {
    boat_pending_updates_aggregate {
      aggregate {
        count
      }
    }
  }
`;
*/
const PENDING_QUERY = gql`
  query MyQuery {
    boat_pending_updates {
      boat
      data
      originator
      uuid
      id
    }
  }
`;

export default function ProcessUpdates() {
    const { loading, error, data } = useQuery(PENDING_QUERY);
    const handlePageChange = (page) => {
        console.log('handlePageChange', page);
    };
    const handlePageSizeChange = (pageSize) => {
        console.log('handlePageSizeChange', pageSize);
    }

    const handleEditCellCommit = (params) => {
        console.log('handleEditCellCommit', params);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    const columns = [
        { field: 'oga_no', headerName: 'No', width: 90 },
        { field: 'name', headerName: 'Name', width: 90 },
        { field: 'originator', headerName: 'Contact', width: 200 },
        { field: 'data', headerName: 'Change', width: 250, editable: true,
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
    ];
    const pending = data.boat_pending_updates.map((item) => {
        return {
            ...item,
            oga_no: item.data.new.oga_no, 
            name: item.data.new.name,
        };
    });

    return (
    <div style={{ height: 350, width: '100%' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            rows={pending} columns={columns} 
            autoPageSize={true} 
            components={{ Toolbar: GridToolbar }}
            onPageChange={(page, details) => handlePageChange(page, details)}
            onPageSizeChange={(pageSize) => handlePageSizeChange(pageSize)}
            onCellEditCommit={(params) => handleEditCellCommit(params)}
          />
        </div>
      </div>
      </div>
);
}