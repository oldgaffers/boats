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
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { BasicHtmlEditor } from "./ddf/RTE";
import {JsonEditor} from "react-jsondata-editor";
const diff = require('htmldiff/src/htmldiff.js');

function TextEditDialog({ title, text, open, onSave, ...props }) {
  const [value, setValue] = useState(text);
  const [isOpen, setIsOpen] = useState(open);

  const handleSave = () => {
    console.log('handleSave', value);
    setIsOpen(false); 
    onSave(value);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={() => { setIsOpen(false); }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edits here can be saved back to the table and then accepted into the boat record.
          </DialogContentText>
          <TextField
           variant='standard'
           fullWidth
           value={value}
           onChange={(e) => setValue(e.target.value)}
            {...props}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function JSONEditDialog({ title, value, open, onSave }) {
  const [edited, setEdited] = useState(JSON.parse(value));
  const [isOpen, setIsOpen] = useState(open);

  const handleChange = (value) => {
    setEdited(value);
  }

  const handleSave = () => {
    console.log('handleSave', edited);
    setIsOpen(false); 
    onSave(edited);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={() => { setIsOpen(false); }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edits here can be saved back to the table and then accepted into the boat record.
          </DialogContentText>
          <JsonEditor jsonObject={value} onChange={handleChange}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function HtmlEditDialog({ title, current, proposed, open, onSave, ...props }) {
  const [html, setHtml] = useState(diff(current, proposed));
  const [isOpen, setIsOpen] = useState(open);
  return (
    <>
      <Dialog open={isOpen} onClose={() => { setIsOpen(false); }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edits here can be saved back to the table and then accepted into the boat record.
          </DialogContentText>
          <BasicHtmlEditor
            data={html}
            onSave={(data) => setHtml(data)}
            {...props}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setIsOpen(false); }}>Cancel</Button>
          <Button onClick={() => {setIsOpen(false); onSave(html);}}>Update</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function renderProposedEditInputCell(params) {
  const { id, api, field, value } = params;
/*
  const handleSave = async (data) => {
    const change = { id, field, value: data };
    console.log('save', change);
    console.log('Q', await api.commitCellChange(change));
    await api.setCellMode(id, field, 'view');
  };
  */
  const handleSave = async (data) => {
    api.setEditCellValue({ id, field, value: data });
    const isValid = await api.commitCellChange({ id, field });
    if (isValid) {
      api.setCellMode(id, field, 'view');
    }
  };

  const title = params.row.field.replace(/_/g, ' ');
  switch (params.row.field) {
    case 'short_description':
      return (<HtmlEditDialog
        title={title}
        open={true}
         //text={value}
         current={params.row.current}
         proposed={params.row.proposed}
        onSave={handleSave}
        controls={["bold", "italic"]}
        />);
    case 'full_description':
      return (<HtmlEditDialog
        title={title}
        open={true}
        // text={value}
        current={params.row.current}
        proposed={params.row.proposed}
       onSave={handleSave}
        controls={["title", "bold", "italic", "numberList", "bulletList", "link", "my-style"]}
        />);
      case 'handicap_data':
      case 'previous_names':
      case 'reference':
      case 'ownerships':
        return (<JSONEditDialog title={title} open={true} value={value} onSave={handleSave}/>);
    default:
      return (<TextEditDialog title={title} open={true} text={value} onSave={handleSave}/>)
  }
}
/*
<GlobalStyles styles={{
          ins: {  textDecoration: 'none', backgroundColor: '#d4fcbc' }, 
          del: { textDecoration: 'line-through', backgroundColor: '#fbb6c2', color: '#555' } 
          }} />
*/

const jsonbFields = [
  "previous_names", "handicap_data", "current_owners", "reference", "ownerships"
];

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
      id update_id
  }
}`;

const UPDATE_STATUS = gql`mutation updateStatus($row: Int!, $status: pending_status_enum!) {
  update_boat_pending_updates_by_pk(pk_columns: {id: $row}, _set: {status: $status})
  {
    status id
  }
}`;

const UPDATE_STATUS_BY_UUID = gql`mutation updateStatusByUuid($uuid: uuid!, $status: pending_status_enum!) {
  update_boat_pending_updates(where: {uuid: {_eq: $uuid}}, _set: {status: $status}) {
    returning {
      id
      status
    }
  }
}`;

const DELETE_PENDING = gql`mutation deleteStatus($row: Int!) {
  delete_boat_pending_updates_by_pk(id: $row) { id }
}`;

export default function ProcessUpdates() {
  const [updateInProgress, setUpdateInProgress] = useState(false);
  const [updateBoat, updateBoatResult] = useMutation(UPDATE_BOAT);
  const [updatePendingItemByUuid, updatePendingItemByUuidResult] = useMutation(UPDATE_STATUS_BY_UUID);
  const [updatePendingItem, updatePendingItemResult] = useMutation(UPDATE_STATUS);
  const [deletePendingItem, deletePendingItemResult] = useMutation(DELETE_PENDING);
  const [getPending, getPendingResult] = useLazyQuery(query);
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    const { data, loading, error, called } = updatePendingItemByUuidResult;
    if ((!error) && (!loading) && called) {
      console.log('successfully updated the status of a row', data.update_boat_pending_updates);
      setUpdateInProgress(false);
    }
  }, [updatePendingItemByUuidResult]);

  useEffect(() => {
    const { data, loading, error, called } = updatePendingItemResult;
    if ((!error) && (!loading) && called) {
      console.log('successfully updated the status of a row', data.update_boat_pending_updates_by_pk);
    }
  }, [updatePendingItemResult]);

  useEffect(() => {
    const { data, loading, error, called } = updateBoatResult;
    if ((!error) && (!loading) && called && updateInProgress) {
      const u = data.update_boat_by_pk;
      console.log('successfully updated a boat', u);
      updatePendingItemByUuid({ variables: { uuid: u.update_id, status: 'done' } })
    }
  }, [updateBoatResult, updatePendingItemByUuid, updateInProgress]);

  useEffect(() => {
    const { data, loading, error, called } = deletePendingItemResult;
    if ((!error) && (!loading) && called) {
      console.log('successfully deleted a row', data.delete_boat_pending_updates_by_pk.id);
      getPendingResult.refetch();
    }
  }, [deletePendingItemResult, getPendingResult]);

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

  if (updateBoatResult.error) {
    console.log('updateBoatResult error');
  }

  if (updatePendingItemResult.error) {
    console.log('updatePendingItemResult error');
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
      },
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
