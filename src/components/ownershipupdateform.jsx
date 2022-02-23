import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import CircularProgress from "@mui/material/CircularProgress";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridActionsCellItem, GridEditInputCell } from '@mui/x-data-grid';
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

const MEMBER_QUERY = gql(`query members($members: [Int]!) {
    members(members: $members) {
      firstname
      lastname
      member
      id
      GDPR
    }
  }`);

export const ownershipUpdateForm = {
    title: "Update Ownerships",
    name: "ownerships",
    component: componentTypes.SUB_FORM,
    TitleProps: { sx: { marginBottom: '1em' } },
    fields: [
        {
            component: componentTypes.PLAIN_TEXT,
            name: 'ddf.ownerships_label',
            label: 'You can add, remove and edit ownership records on this page.'
                + ' If you are listed as an owner and this is no-longer true just add an end year.'
                + ' Your changes will be send to the editors who will update the boat\'s record'
        },
        {
            component: "ownership-form",
            name: "ownerships",
            label: "Known Owners",
        },
    ],
};

const queryIf = (o) => o.member && (o.name === undefined || o.name.trim() === '');

function MemberEditInputCell(props) {
    const [name, setName] = useState(props.value);
    const [inputName, setInputName] = useState(props.value);
    const [isMember, setIsMember] = useState(true);
    const [isOpen, setIsOpen] = useState(true);

    const handleTextChange = (event) => {
        setName(event.target.value);
    };

    const onIsMemberChange = (event) => {
        console.log('onIsMemberChange', event.target.checked);
        setIsMember(event.target.checked);
    };

    const handleSave = (event) => {
        const { id, api, field } = props;
        console.log('handleSave', name);
        setIsOpen(false);
        if (isMember) {
            console.log('member - TODO set cell and add membership number and gold id to row');
            //  { firstname: "Alison", lastname: "Cable", GDPR: true, id: 7, share: 32, start: 2007, member: 5004, ID: 1219 }​
        } else {
            api.setEditCellValue({ id, field, value: name }, event);
        }
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
                            options={['me', 'you']}
                            autoComplete
                            onChange={(event, newValue) => {
                                setName(newValue);
                            }}
                            inputValue={inputName}
                            onInputChange={(event, newInputValue) => {
                                setInputName(newInputValue);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} 
                                    variant='outlined'
                                    label='Name'
                                    fullWidth
                                    value={name}
                                    onChange={handleTextChange}
                                />
                            )}
                        />
                        :
                        <TextField
                            variant='outlined'
                            label='Name'
                            fullWidth
                            value={name}
                            onChange={handleTextChange}
                        />
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Update</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default function OwnershipForm(props) {
    const { user } = useAuth0();
    const { input } = useFieldApi(props);

    let membership;
    if (user && user['https://oga.org.uk/id'] && user['https://oga.org.uk/member']) {
        membership = {
            id: parseInt(user['https://oga.org.uk/id']),
            member: parseInt(user['https://oga.org.uk/member']),
        };
    }
    const [getMembers, getMembersResults] = useLazyQuery(MEMBER_QUERY);
    if (getMembersResults.loading) return <CircularProgress />;

    const owners = input.value.owners || [];
    if (owners.length === 0 && input.value.current) {
        const current = input.value.current.map((c) => ({ ...c, current: true }));
        owners.push(...current);
    }

    if (getMembersResults.error) {
        console.log(`Error! ${getMembersResults.error}`);
    }

    const memberNumbers = [...new Set(owners.filter((o) => queryIf(o)).map((o) => o.member))];
    if (membership && !memberNumbers.includes(membership.member)) {
        memberNumbers.push(membership.member);
        // be nice to use user.name but this isn't always provided.
        // unless we add it to user metadata from GOLD
    }

    let theirBoat = false;
    if (membership) {
        const currentRecords = input.value.current || owners.filter((o) => o.current);
        const currentIds = currentRecords.map((o) => o.id);
        theirBoat = currentIds.includes(membership.id);
    }

    let members = [];
    if (getMembersResults.data) {
        if (getMembersResults.data.members) {
            members = getMembersResults.data.members;
        }
    } else if (memberNumbers.length > 0) {
        getMembers({ variables: { members: memberNumbers } });
    }

    const ownerNameSetter = ({ value, row }) => {
        if (row.ID) {
            return row;
        }
        return { ...row, name: value };
    };

    const ownerNameGetter = (owner) => {
        if (owner.name) {
            return owner.name;
        }
        const m = members.filter((member) => member.id === owner.ID);
        if (m.length > 0) {
            const { firstname, lastname, GDPR } = m[0];
            console.log('N', { firstname, lastname, GDPR, ...owner })
            return { firstname, lastname, GDPR, ...owner };
        }
        if (owner.note) {
            return owner.note;
        }
        return '';
    }

    const ownerNameFormatter = (owner) => {
        if (typeof owner === 'string') {
            return owner;
        }
        const m = members.filter((member) => member.id === owner.ID);
        if (m.length > 0) {
            const { firstname, lastname, GDPR } = m[0];
            if (GDPR) {
                return `${firstname} ${lastname}`;
            } else {
                return `name of member ${m[0].member}:${m[0].id} withheld`
            }
        }
        if (owner.note) {
            return owner.note;
        }
        return '';
    }

    const ownerNameEditor = (params) => {
        const { id, api, field, value, row } = params;
        if (typeof value === 'string' && value !== '') {
            return (<GridEditInputCell {...params} />);
        } else {
            return (<MemberEditInputCell id={id} field={field} value={value} row={row} api={api} />);
        }
    }

    const ends = owners.filter((o) => o.end).sort((a, b) => a.end < b.end);
    const lastEnd = (ends.length > 0) ? ends[0].end : undefined;

    const handleClaim = () => {
        const family = members.filter((m) => m.member === membership.member);
        family.forEach((m) => {
            const o = { start: lastEnd, id: m.id, member: m.member, current: true, share: Math.floor(64 / family.length) };
            owners.push(o);
        })
        // setOwnerships({ ...ownerships, owners });
        input.onChange({ owners });
    }

    const handleAddRow = () => {
        owners.push({ name: '', start: lastEnd, share: 64 });
        // setOwnerships({ ...ownerships, owners });
        input.onChange({ owners });
    }

    const deleteRow = (row) => {
        const o = owners.filter((o, index) => index !== row.id);
        // setOwnerships({ ...ownerships,  owners: o });
        input.onChange({ owners: o });
    }

    // set current = false if and end year is added
    const handleCellEditCommit = (params) => {
        const { field, value, id } = params;
        console.log('P', params);
        if (field === 'end' && value && value !== '') {
            console.log('end updated');
            console.log('entry is', owners[id])
            if (owners[id].current) {
                delete owners[id].current;
                // setOwnerships({ ...ownerships,  owners });
            }
        }
        owners[id][field] = value;
        input.onChange({ owners });
    };

    const ownersWithId = owners.map((owner, index) => {
        return {
            ...owner,
            id: index,
            ID: owner.id, // needed for ownerName
        }
    }).sort((a, b) => a.start > b.start);

    return (
        <div style={{ height: 300, width: '100%' }}>
            <DataGrid
                rows={ownersWithId}
                columns={[
                    {
                        field: 'name',
                        headerName: 'Name',
                        flex: 1,
                        editable: true,
                        valueGetter: ({ row }) => ownerNameGetter(row),
                        valueFormatter: ({ value }) => ownerNameFormatter(value),
                        valueSetter: ownerNameSetter,
                        renderEditCell: ownerNameEditor,
                    },
                    { field: 'start', headerName: 'Start', width: 90, editable: true, valueGetter: ({ row }) => row.start || '?' },
                    { field: 'end', headerName: 'End', width: 90, editable: true, valueGetter: ({ row }) => row.end || '-' },
                    { field: 'share', headerName: 'Share', width: 90, editable: true, valueFormatter: ({ value }) => value ? `${value}/64` : '' },
                    {
                        width: 40,
                        field: 'actions',
                        type: 'actions',
                        getActions: ({ row }) => [
                            <GridActionsCellItem
                                icon={<DeleteIcon />}
                                label="Delete"
                                onClick={() => deleteRow(row)}
                            />,
                        ]
                    }
                ]}
                autoPageSize={true}
                onCellEditCommit={handleCellEditCommit}
                isCellEditable={(params) => !params.row.ID || params.field !== 'name'}
            />
            <Stack
                sx={{ width: '100%', mb: 1 }}
                direction="row"
                alignItems="flex-start"
                columnGap={1}
            >
                {theirBoat ? '' : (
                    <Button size="small" onClick={handleClaim}>
                        This is my boat
                    </Button>)
                }
                <Button size="small" onClick={handleAddRow}>
                    Add a record
                </Button>
            </Stack>
        </div>
    );
}
