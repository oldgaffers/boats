import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import CircularProgress from "@mui/material/CircularProgress";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useLazyQuery, gql } from '@apollo/client';

const MEMBER_QUERY = gql(`query members($members: [Int]!) {
    members(members: $members) {
      firstname
      lastname
      member
      id
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
            +' If you are listed as an owner and this is no-longer true just add an end year.'
            +' Your changes will be send to the editors who will update the boat\'s record'
        },
        {
            component: "ownership-form",
            name: "ownerships",
            label: "Known Owners",
        },
    ],
};

const queryIf = (o) => o.member && (o.name === undefined || o.name.trim() === '');

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
        getMembers({ variables: {members: memberNumbers }});
    }

    const ownerName = (owner) => {
        if (owner.name) {
            return owner.name;
        }
        const m = members.filter((member) => member.id === owner.ID);
        if (m.length > 0) {
            return `${m[0].firstname} ${m[0].lastname}`;
        }
        if (owner.note) {
            return owner.note;
        }
        return '';
    }

    const ends = owners.filter((o) => o.end).sort((a, b) => a.end < b.end);
    const lastEnd = (ends.length > 0) ? ends[0].end : undefined;
    console.log('new owner could start at', lastEnd);

    const handleClaim = () => {
        const family = members.filter((m) => m.member === membership.member);
        family.forEach((m) => {
            const o = { start: lastEnd, id: m.id, member: m.member, current: true, share: Math.floor(64/family.length) };
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
    const handleCellEditCommit = ({ field, value, id }) => {
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
                    { field: 'name', headerName: 'Name', flex: 1, editable: true, valueGetter: ({ row }) => ownerName(row) },
                    { field: 'start', headerName: 'Start', width: 90, editable: true, valueGetter: ({ row }) => row.start || '?' },
                    { field: 'end', headerName: 'End', width: 90, editable: true, valueGetter: ({ row }) => row.end || '-' },
                    { field: 'share', headerName: 'Share', width: 90, editable: true, valueFormatter: ({ value }) => value ? `${value}/64` : '' },
                    {
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
            />
            <Stack
                sx={{ width: '100%', mb: 1 }}
                direction="row"
                alignItems="flex-start"
                columnGap={1}
            >
                {theirBoat?'':(
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
