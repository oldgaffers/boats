import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useLazyQuery, gql } from '@apollo/client';
import Switch from "@mui/material/Switch";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from "@mui/material/FormControlLabel";
import { Autocomplete } from '@mui/material';

export function memberFormatter(n) {
    return `${n.firstname} ${n.lastname} (mem${n.GDPR ? '✓' : ''})`;
}

const MEMBER_NAME_QUERY = gql(`query members($name: String!) {
    members(lastname: $name) {
      firstname
      lastname
      member
      id
      GDPR
      town area
    }
  }`);

export default function EditOwner({value, onSave}) {
    const [getMembers, getMembersResults] = useLazyQuery(MEMBER_NAME_QUERY);
    const [ownership, setOwnership] = useState(value);
    const [inputName, setInputName] = useState(value.name || '');
    const [isMember, setIsMember] = useState(true);
    const [isOpen, setIsOpen] = useState(true);

    const handleNameChange = (event) => {
        const n = event.target.value;
        console.log('setName', n);
        setOwnership({ ...ownership, name: n });
        if (n.length > 1) {
            getMembers({ variables: { name: n } });
        }
    };

    const handleMemberChange = (event) => {
        const n = event.target.value;
        console.log('handleMemberChange', n);
        setOwnership({ ...ownership, name: n });
        if (n.length > 1) {
            getMembers({ variables: { name: n } });
        }
    };

    const onIsMemberChange = (event) => {
        console.log('onIsMemberChange', event.target.checked);
        setIsMember(event.target.checked);
    };

    return (
        <div>
            <Dialog open={isOpen} onClose={() => { setIsOpen(false); }}>
                <DialogTitle>Owner Identity</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Ownership records are held on public storage so OGA Members are stored by their membership Id.
                    </DialogContentText>
                    <FormControlLabel
                        onChange={onIsMemberChange}
                        control={<Switch checked={isMember} />}
                        label="OGA Member"
                    />
                    {isMember ?
                        <Autocomplete
                            options={getMembersResults.data ? getMembersResults.data.members : []}
                            autoComplete
                            filterOptions={(x) => x}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            loading={getMembersResults.loading}
                            getOptionLabel={(m) => {
                                return `${m.firstname} ${m.lastname} (${m.town}, ${m.area})`
                            }}
                            onChange={(event, n) => {
                                console.log('onChange', n);
                                const o = {
                                    name: memberFormatter(n),
                                    id: n.id,
                                    member: n.member,
                                }
                                console.log('setOwnership', o)
                                setOwnership(o);
                            }}
                            inputValue={inputName}
                            onInputChange={(event, val) => {
                                console.log('onInputChange', val);
                                setInputName(val);
                            }}
                            renderInput={(params) => (
                                <TextField {...params}
                                    variant='outlined'
                                    label='Name'
                                    fullWidth
                                    value={ownership.id}
                                    onChange={handleMemberChange}
                                />
                            )}
                        />
                        :
                        <TextField
                            variant='outlined'
                            label='Name'
                            fullWidth
                            value={ownership.name}
                            onChange={handleNameChange}
                        />
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={(event) => { onSave(ownership, event); setIsOpen(false)}}>Update</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
