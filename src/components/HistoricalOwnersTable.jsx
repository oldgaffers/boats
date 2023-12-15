import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridActionsCellItem, useGridApiContext } from '@mui/x-data-grid';
import { Typography } from '@mui/material';

function ownerNameEditor(a) {
    console.log('E', a);
}

function yearFormatter(y) {
    if (isNaN(y)) {
        return '';
    }
    return y;
}

export default function HistoricalOwnersTable({ owners, members }) {
    const [historicalOwners, setHistoricalOwners] = useState(owners);

    const lastEnd = () => {
        return historicalOwners.map((o) => o.end).reduce((a, b) => Math.max(a, b), -Infinity);
    };

    const handleAddRow = (x,y,z) => {
        setHistoricalOwners([...historicalOwners, { id: historicalOwners.length, name: '', start: lastEnd(), share: 64 }]);
    }

    const deleteRow = (row) => {
        const o = historicalOwners.filter((o, index) => index !== row.id);
        setHistoricalOwners(o);
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

    return <>
        <Box>
            <Typography variant='h6'>Historical Owners</Typography>
        </Box>
        <Box sx={{ height: '215px' }}>
            <DataGrid
                experimentalFeatures={{ newEditingApi: true }}
                rows={historicalOwners}
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
                    { field: 'start', headerName: 'Start', type: 'number', width: 90, editable: true, valueFormatter: yearFormatter },
                    { field: 'end', headerName: 'End', width: 90, type: 'number', editable: true, valueFormatter: yearFormatter },
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
            />;
        </Box>
        <Box>
            <Button size="small" onClick={handleAddRow}>
                Add a record
            </Button>
        </Box>
    </>;
}