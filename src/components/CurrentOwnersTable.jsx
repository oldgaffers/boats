import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { yearFormatter } from './HistoricalOwnersTable';

export default function OwnersTable({ owners, onMakeHistorical, onUpdate }) {
    const { user } = useAuth0();

    let membership;
    if (user && user['https://oga.org.uk/id'] && user['https://oga.org.uk/member']) {
        membership = {
            id: parseInt(user['https://oga.org.uk/id']),
            member: parseInt(user['https://oga.org.uk/member']),
        };
    }

    const theirBoat = owners.map((o) => o.goldId).includes(membership?.id);

    const handleAddRow = () => {
        // use negative ids to not clash with provided ids
        const r = {
            id: -owners.length,
            name: 'An Owner',
            start: new Date().getFullYear(),
            share: 64,
            current: true,
        };
        onUpdate([...owners, r]);
    }

    const deleteRow = (row) => {
        const o = owners.filter((o) => o.id !== row.id);
        onUpdate(o);
    }

    const handleCellEditStop = ({ reason }, event) => {
        if (reason === 'enterKeyDown') {
            event.preventDefault();
            event.stopPropagation();
        }
    };

    const processRowUpdate = (updatedRow, originalRow) => {
        // console.log('processRowUpdate', updatedRow, originalRow);
        const updated = owners.map((o) => {
            if (o.id === updatedRow.id) {
                return updatedRow;
            }
            return o;
        });
        onUpdate(updated);
        return updatedRow;
    };

    const handleClaim = () => {
        // console.log('handleClaim');
        const r = {
            id: -owners.length,
            name: `${user.given_name} ${user.family_name}`,
            start: new Date().getFullYear(),
            share: 64,
            current: true,
            goldId: membership.id,
            member: membership.member,
        };
        onUpdate([...owners, r]);
    }

    const endOwnership = (p) => {
        // console.log('endOwnership', p);
        const { current, ...rest } = p;
        onMakeHistorical({ ...rest, end: new Date().getFullYear() });
    };

    if (!user) {
        return <Typography sx={{marginTop: 1}}>To propose updates to current ownerships please log-in.</Typography>
    }

    return <>
        <Box>
            <Typography variant='h7'>Current</Typography>
        </Box>
        <Box>
            {theirBoat ? (
                <>
                <Button size="small" onClick={() => deleteRow(owners.find((o) => o.goldId === membership.id))}>
                    This was never my boat
                </Button>
                <Button size="small" onClick={() => endOwnership(owners.find((o) => o.goldId === membership.id))}>
                    This isn't my boat any longer
                </Button>
                </>
            ) : (
                <Button size="small" onClick={handleClaim}>
                    This is my boat
                </Button>)
            }
        </Box>
        <Box sx={{ height: '215px' }}>
            <DataGrid
                experimentalFeatures={{ newEditingApi: true }}
                rows={owners}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={(error) => console.log(error)}
                onCellEditStop={handleCellEditStop}
                columns={[
                    {
                        field: 'name',
                        headerName: 'Name',
                        flex: 1,
                        editable: true,
                        valueFormatter: ({ value }) => value ?? 'N/A',
                    },
                    { field: 'goldId', headerName: 'goldId', width: 0, editable: true, hide: true, },
                    { field: 'member', headerName: 'Member', width: 0, editable: true, hide: true, },
                    { field: 'start', headerName: 'Start', type: 'text', width: 60, editable: true, valueFormatter: yearFormatter },
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