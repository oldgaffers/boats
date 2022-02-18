import React, { useState, useRef } from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { DataGrid } from '@mui/x-data-grid';
import { useMutation, useLazyQuery, gql } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';

const queryIf = (o) => o.member && (o.name === undefined || o.name.trim() === '');

function ClaimDialog({ boat, onClose, open, start=2000 }) {
  const yearRef = useRef('');
  const shareRef = useRef('');

  const handleCancel = () => {
    onClose();
  }

  const handleSave = () => { 
    onClose({ start: parseInt(yearRef.current.value, 10), share: parseInt(shareRef.current.value, 10) });
  };

  return (
    <Dialog aria-labelledby="updateboat-dialog-title" open={open}>
      <DialogTitle>I own {boat.name}</DialogTitle>
      <DialogContent>
          <DialogContentText>
            That's great. Please tell us when you acquired {boat.name}.
          </DialogContentText>
          <DialogContentText>
             If you share ownership with someone else enter the number of 64ths you own.
          </DialogContentText>
          <TextField label="Year Acquired" variant="standard"  inputProps={{ inputMode: 'numeric', pattern: '[0-9]{4}' }} defaultValue={start} inputRef={yearRef} />
          <TextField label="Share" variant="standard"  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} defaultValue={64} inputRef={shareRef} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Ok</Button>
        </DialogActions>
    </Dialog>
  );
}

function OwnersTable({ owners, membership, email, boat }) {
  const [claimOpen, setClaimOpen] = useState(false);
  const memberNumbers = owners.filter((o) => queryIf(o)).map((o) => o.member);
  const [getMembers, getMembersResults] = useLazyQuery(gql(`query members {
    members(members: ${JSON.stringify(memberNumbers)}) {
      firstname
      lastname
      member
      id
    }
  }`));
  const [addOwner, addOwnerResults] = useMutation(gql`mutation addOwner($boat: uuid!, $current: String!, $field: String!, $originator: String!, $proposed: String!, $uuid: uuid!) {
    insert_boat_pending_updates(objects: {boat: $boat, current: $current, field: $field, originator: $originator, proposed: $proposed, uuid: $uuid})
    { affected_rows }
  }`);
  if (getMembersResults.loading) return <CircularProgress />;
  let ownersWithNames = owners;
  if (getMembersResults.error) {
    console.log(`Error! ${getMembersResults.error}`);
  }
  let members = [];
  if (getMembersResults.data) {
    if (getMembersResults.data.members) {
      members = getMembersResults.data.members;
    }
  } else if (memberNumbers.length > 0) {
    getMembers();
  }
  ownersWithNames = owners.map((owner, index) => {
    if (owner.name) {
      return { ...owner, id: index };
    }
    let name = '';
    const m = members.filter((member) => member.id === owner.id);
    if (m.length > 0) {
      name = `${m[0].firstname} ${m[0].lastname}`;
    }
    return {
      ...owner,
      name,
      id: index,
    }
  }).sort((a, b) => a.start > b.start);
  
  const handleClaim = () => {
    console.log('claim', membership);
    setClaimOpen(true);
  }
  console.log('addOwnerResults', addOwnerResults); // TODO

  const ends = owners.filter((o) => o.end).sort((a, b) => a.end < b.end);
  const lastEnd =(ends.length>0) ? ends[0].end : undefined;

  const handleClaimClose = (claim) => {
    if (claim) {
      console.log('handleClaimClose', claim, membership, boat.id);
      addOwner({
        variables: {
        boat: boat.id,
        field: 'ownerships', 
        current: JSON.stringify({ owners }), 
        proposed: JSON.stringify({ owners: [...owners, {current: true, ...membership, ...claim }]}),
        originator: email, 
        uuid: uuidv4()
      }});
    }
    setClaimOpen(false);
  }

  const handleAddRow = () => console.log('add');

  return (
    <div style={{ width: '100%' }}>
      <Box sx={{ height: 400, bgcolor: 'background.paper' }}>
        <DataGrid
          rows={ownersWithNames}
          columns={[
            { field: 'name', headerName: 'Name', flex: 1, valueGetter: ({ row }) => row.name || row.note },
            { field: 'start', headerName: 'Start', width: 90, valueGetter: ({ row }) => row.start || '?' },
            { field: 'end', headerName: 'End', width: 90, valueGetter: ({ row }) => row.end || '-' },
            { field: 'share', headerName: 'Share', width: 90, valueGetter: ({ row }) => row.share ? `${row.share}/64` : '' },
          ]}
        />
      </Box>
      <Stack
        sx={{ width: '100%', mb: 1 }}
        direction="row"
        alignItems="flex-start"
        columnGap={1}
      >
        <Button size="small" onClick={handleClaim}>
          This is my boat
        </Button>
        <ClaimDialog open={claimOpen} boat={boat} membership={membership} onClose={handleClaimClose} start={lastEnd} />
        <Button size="small" onClick={handleAddRow}>
          I know of other people who have owned her
        </Button>
      </Stack>
    </div>
  );
}

export default function Owners({ boat, membership, email }) {
  const { current, owners } = boat.ownerships || { current: [], owners: [] };
  if (owners && owners.length > 0) {
    return (
      <Paper>
        <OwnersTable owners={owners} membership={membership} boat={boat} email={email} />
      </Paper>
    );
  }
  console.log('no owners, using current')
  if (current && current.length > 0) {
    return (
      <Paper>
        <OwnersTable owners={current} membership={membership} boat={boat} email={email} />
      </Paper>
    );
  }
  console.log('no current, returning empty div');
  return (<div />);
}
