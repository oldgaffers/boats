import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Typography } from '@mui/material';

export function yearFormatter({ value }) {
    if (isNaN(value)) {
        return '';
    }
    if (value === 0) {
        return '';
    }
    return value;
}

// note id fields are numeric but not contiguous or starting from zero
// because current and historical owners are split

export default function ownersTable({ owners, onUpdate }) {

    const lastEnd = () => {
        return owners.map((o) => o.end).reduce((a, b) => Math.max(a, b), -Infinity);
    };

    const handleAddRow = () => {
        // use negative ids to not clash with provided ids
        const r = { id: -owners.length, name: 'An Owner', start: lastEnd(), share: 64 };
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

    return <>
        <Box>
            <Typography variant='h6'>Historical Owners</Typography>
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