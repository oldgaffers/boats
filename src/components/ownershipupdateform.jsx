import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import CircularProgress from "@mui/material/CircularProgress";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridActionsCellItem, GridEditInputCell } from '@mui/x-data-grid';
import { useLazyQuery, gql } from '@apollo/client';
import EditOwner, { memberFormatter } from './editowner';

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

export default function OwnershipForm(props) {

    const { user } = useAuth0();
    const { input } = useFieldApi(props);

    const [owners, setOwners] = useState(input.value || []);

    useEffect(() => {
        // console.log('useEffect', owners);
        //input.onChange(owners);
    }, [owners]);

    let membership;
    if (user && user['https://oga.org.uk/id'] && user['https://oga.org.uk/member']) {
        membership = {
            id: parseInt(user['https://oga.org.uk/id']),
            member: parseInt(user['https://oga.org.uk/member']),
        };
    }

    let theirBoat = false;

    const memberNumbers = [...new Set(owners.filter((o) => queryIf(o)).map((o) => o.member))];
    if (membership) {
        if (!memberNumbers.includes(membership.member)) {
            memberNumbers.push(membership.member);
        }
        const currentRecords = input.value.current || owners.filter((o) => o.current);
        const currentIds = currentRecords.map((o) => o.id);
        theirBoat = currentIds.includes(membership.id);
    }

    const [getMembers, getMembersResults] = useLazyQuery(MEMBER_QUERY);

    if (getMembersResults.loading) return <CircularProgress />;

    const members = [];
    if (getMembersResults.error) {
        // console.log(`Error! ${getMembersResults.error}`);
    } else {
        if (getMembersResults.data) {
            if (getMembersResults.data.members) {
                members.push(...getMembersResults.data.members);
            } else {
                getMembers({ variables: { members: memberNumbers } });
            }
        } else {
            if (getMembersResults.called) {
                // console.log('called but not loading');
            } else {
                // console.log('not called, calling now', memberNumbers);
                getMembers({ variables: { members: memberNumbers } });
            }
        }
    }

    const ownerNameGetter = (owner) => {
        if (owner.name) {
            return owner.name;
        }
        const m = members.filter((member) => member.id === owner.goldId);
        if (m.length > 0) {
            const { firstname, lastname, GDPR } = m[0];
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
        const m = members.filter((member) => member.id === owner.goldId);
        if (m.length > 0) {
            if (m[0].GDPR) {
                return memberFormatter(m[0]);
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
        const { id, api, value, row } = params;
        if (typeof value === 'string' && value !== '') {
            return (<GridEditInputCell {...params} />);
        } else {
            const onSaveRow = async (ownership, event) => {
                const { name, ...rest } = ownership;
                const o = [...owners];
                // const { share, start, end } = o[id];
                o[id] = { ...o[id], ...rest };
                setOwners(o);
                await api.setEditCellValue({ id, field: 'name', value: name }, event);
            }
            return (<EditOwner value={row} onSave={onSaveRow} />);
        }
    }

    const ends = owners.filter((o) => o.end).sort((a, b) => a.end < b.end);
    const lastEnd = (ends.length > 0) ? ends[0].end : undefined;

    const handleClaim = () => {
        // console.log('handleClaim');
        const family = members.filter((m) => m.member === membership.member);
        const no = [];
        family.forEach((m) => {
            const o = { start: lastEnd, id: m.id, member: m.member, current: true, share: Math.floor(64 / family.length) };
            no.push(o);
        })
        setOwners([...owners, ...no]);
    }

    const handleRowUpdate = (row) => {
        // console.log('handleRowUpdate', row);
    };

    const handleCellEditStop = (r) => {
        // console.log('handleRowUpdate', r);
    };
    
    const handleRowEditStop = (r) => {
        // console.log('handleRowEditStop', r);
    }

    const handleAddRow = () => {
        setOwners([...owners, { name: '', start: lastEnd, share: 64 }]);
    }

    const deleteRow = (row) => {
        const o = owners.filter((o, index) => index !== row.id);
        setOwners(o);
    }

    const ownersWithId = owners.map((owner, index) => {
        return {
            ...owner,
            id: index,
            goldId: owner.id, // needed for ownerName
        }
    }).sort((a, b) => a.start > b.start);

    return (
        <Box sx={{
            width: '100%',
            marginRight: "1em",
            border: "0.5em", display: 'grid', gridTemplateRows: 'auto',
            }}
        >
            <Box sx={{height: '300px'}}>
                <DataGrid
                    experimentalFeatures={{ newEditingApi: true }}
                    rows={ownersWithId}
                    onCellEditStop={handleCellEditStop}
                    onRowEditStop={handleRowEditStop}
                    onProcessRowUpdate={handleRowUpdate}
                    columns={[
                        {
                            field: 'name',
                            headerName: 'Name',
                            flex: 1,
                            editable: true,
                            valueGetter: ({ row }) => ownerNameGetter(row),
                            valueFormatter: ({ value }) => ownerNameFormatter(value),
                            renderEditCell: ownerNameEditor,
                        },
                        { field: 'goldId', headerName: 'goldId', width: 0, editable: true, hide: true, },
                        { field: 'member', headerName: 'Member', width: 0, editable: true, hide: true, },
                        { field: 'start', headerName: 'Start', type: 'text', width: 90, editable: true } ,
                        { field:   'end', headerName: 'End', width: 90, type: 'text', editable: true },
                        { field: 'share', headerName: 'Share', width: 90, type: 'number', editable: true, valueFormatter: ({ value }) => value ? `${value}/64` : '' },
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
                    isCellEditable={(params) => true}
                    initialState={{
                        columns: {
                            columnVisibilityModel: {
                                goldId: false,
                                member: false,
                            },
                        },
                    }}
                />
            </Box>
                <Box sx={{ border: "0.5em", display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                    <Box>
                        {theirBoat ? '' : (
                            <Button size="small" onClick={handleClaim}>
                                This is my boat
                            </Button>)
                        }
                    </Box>
                    <Box>
                        <Button size="small" onClick={handleAddRow}>
                            Add a record
                        </Button>
                    </Box>
                </Box>
        </Box>
    );
}
