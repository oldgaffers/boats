import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import EventBusyIcon from '@mui/icons-material/EventBusy';

function ownerNameEditor(a) {
    console.log('E', a);
}

export default function CurrentOwnersTable({ owners }) {
    const [currentOwners, setCurrentOwners] = useState(owners);
    const { user } = useAuth0();

    let membership;
    if (user && user['https://oga.org.uk/id'] && user['https://oga.org.uk/member']) {
        membership = {
            id: parseInt(user['https://oga.org.uk/id']),
            member: parseInt(user['https://oga.org.uk/member']),
        };
    }

    const theirBoat = currentOwners.map((o) => o.id).includes(membership?.id);

    const lastEnd = () => {
        return currentOwners.map((o) => o.end).reduce((a, b) => Math.max(a, b), -Infinity);
    };

    const handleAddRow = () => {
        setCurrentOwners([...currentOwners, { name: '', start: lastEnd(), share: 64 }]);
    }

    const deleteRow = (row) => {
        const o = currentOwners.filter((o, index) => index !== row.id);
        setCurrentOwners(o);
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

    const handleClaim = () => {
        // console.log('handleClaim');
        /*
        const family = members.filter((m) => m.member === membership.member);
        const no = [];
        family.forEach((m) => {
            const o = { start: lastEnd, id: m.id, member: m.member, current: true, share: Math.floor(64 / family.length) };
            no.push(o);
        })
        setCurrentOwners([...currentOwners, ...no]);
        */
    }

    const endOwnership = () => {
        console.log('endOwnership');
    };

    if (!user) {
        return <Typography sx={{marginTop: 1}}>To propose updates to current ownerships please log-in.</Typography>
    }

    return <>
        <Box>
            <Typography variant='h6'>Current Owners</Typography>
        </Box>
        <Box>
            {theirBoat ? '' : (
                <Button size="small" onClick={handleClaim}>
                    This is my boat
                </Button>)
            }
        </Box>
        <Box sx={{ height: '215px' }}>
            <DataGrid
                experimentalFeatures={{ newEditingApi: true }}
                rows={currentOwners}
                onCellEditStop={handleCellEditStop}
                onRowEditStop={handleRowEditStop}
                onProcessRowUpdate={handleRowUpdate}
                columns={[
                    {
                        field: 'name',
                        headerName: 'Name',
                        flex: 1,
                        editable: true,
                        valueFormatter: ({ value }) => value ?? 'N/A',
                        renderEditCell: ownerNameEditor,
                    },
                    { field: 'goldId', headerName: 'goldId', width: 0, editable: true, hide: true, },
                    { field: 'member', headerName: 'Member', width: 0, editable: true, hide: true, },
                    { field: 'start', headerName: 'Start', type: 'text', width: 60, editable: true },
                    { field: 'share', headerName: 'Share', width: 70, type: 'number', editable: true, valueFormatter: ({ value }) => value ? `${value}/64` : '' },
                    {
                        width: 60,
                        field: 'actions',
                        type: 'actions',
                        getActions: ({ row }) => [
                            <GridActionsCellItem
                                icon={<EventBusyIcon />}
                                label="End"
                                onClick={() => endOwnership(row)}
                            />,
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
                <Button size="small" onClick={handleAddRow}>
                    Add a record
                </Button>
            </Box>
        </Box>
    </>;
}