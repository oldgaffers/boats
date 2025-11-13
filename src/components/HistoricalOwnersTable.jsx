import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import { DataGrid, GridActionsCellItem, GridArrowDownwardIcon, GridArrowUpwardIcon } from '@mui/x-data-grid';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

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

    function moveUp(id, index) {
        console.log('move up', id, index);
        const after = [...owners];
        after[index - 1] = owners[index];
        after[index] = owners[index - 1];
        onUpdate(after);
    }

    function moveDown(id, index) {
        console.log('move down', id, index);
        const after = [...owners];
        after[index + 1] = owners[index];
        after[index] = owners[index + 1];
        onUpdate(after);
    }

    function reorderRenderer({ row, api }) {
        const rowCount = api.getRowsCount();
        if (rowCount < 2) {
            return 0;
        }
        const lastIndex = owners.length - 1;
        const index = owners.reduce((acc, o, index) => {
            if (row.id === o.id) {
                return index;
            }
            return acc;
        }, -1);
        if (index === 0) {
            return (<><GridArrowDownwardIcon onClick={() => moveDown(row.id, index)} /></>);
        } else if (index === lastIndex) {
            return (<><GridArrowUpwardIcon onClick={() => moveUp(row.id, index)} /></>);
        } else {
            return (<>
                <GridArrowDownwardIcon onClick={() => moveDown(row.id, index)} />
                <GridArrowUpwardIcon onClick={() => moveUp(row.id, index)} />
            </>);
        }
    }

    const lastEnd = () => {
        return owners.map((o) => o.end).reduce((a, b) => Math.max(a, b), 1800);
    };

    const handleAddRow = () => {
        // use negative ids to not clash with provided ids
        const r = { id: -1-owners.length, name: 'An Owner', start: lastEnd(), share: 64 };
        onUpdate([...owners, r]);
    }

    const deleteRow = (row) => {
        const o = owners.filter((o) => o.id !== row.id);
        onUpdate(o);
    }

    const makeCurrent = (row) => {
        row.current = true;
        onUpdate(owners);
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

    // TODO ?
    const reorderNeeded = !!owners.find((o) => !o.start);

    if (reorderNeeded) {
        // console.log('reorderNeeded', reorderNeeded);
    }

    return <Accordion>
        <AccordionSummary expandIcon={<ExpandCircleDownIcon />}>Historical</AccordionSummary>
        <AccordionDetails sx={{ height: '40vh', minHeight: '215px' }}>
            <DataGrid
                experimentalFeatures={{ newEditingApi: true }}
                rows={owners}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={(error) => console.log(error)}
                onCellEditStop={handleCellEditStop}
                columns={[
                    {
                        headerName: 'Move',
                        field: 'reorder',
                        width: 80,
                        renderCell: reorderRenderer,
                    },
                    {
                        sortable: false,
                        field: 'name',
                        headerName: 'Name',
                        flex: 1,
                        editable: true,
                        valueFormatter: ({ value }) => value ?? 'N/A',
                    },
                    { field: 'goldId', sortable: false, headerName: 'goldId', width: 0, editable: true, hide: true, },
                    { field: 'member', sortable: false, headerName: 'Member', width: 0, editable: true, hide: true, },
                    { field: 'start', sortable: false, headerName: 'Start', type: 'number', width: 90, editable: true, valueFormatter: yearFormatter },
                    { field: 'end', sortable: false, headerName: 'End', width: 90, type: 'number', editable: true, valueFormatter: yearFormatter },
                    { field: 'share', sortable: false, headerName: 'Share', width: 90, type: 'number', editable: true, valueFormatter: ({ value }) => value ? `${value}/64` : '' },
                    {
                        sortable: false,
                        width: 40,
                        field: 'actions',
                        type: 'actions',
                        getActions: ({ row }) => [
                            <Tooltip key={0} title="Make current">
                                <GridActionsCellItem
                                    icon={<EventIcon />}
                                    label="End"
                                    onClick={() => makeCurrent(row)}
                                />
                            </Tooltip>,
                            <Tooltip key={1} title="Delete record">
                                <GridActionsCellItem
                                    icon={<DeleteIcon />}
                                    label="Delete"
                                    onClick={() => deleteRow(row)}
                                />
                            </Tooltip>,
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
        </AccordionDetails>
        <AccordionActions>
            <Button size="small" onClick={handleAddRow}>
                Add a record
            </Button>
        </AccordionActions>
    </Accordion>;
}