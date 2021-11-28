import React, { useState } from 'react'
import Divider from '@material-ui/core/Divider'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Slider from '@material-ui/core/Slider';
import FormHelperText from '@material-ui/core/FormHelperText';
import Picker from './picker'
 
const opposite = { asc: 'desc', desc: 'asc' };
const yearProps = { max: new Date().getFullYear()+1, step: 10 };
yearProps.min = yearProps.max - 20*yearProps.step;

const pageSize = [];
for(let i=1; i<=8; i++) {
    pageSize.push({name: `${6*i}` });
}

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: 200,
      },
    },
  }));

function makePicklist(view, pickers, field) {
    if (view[field]) {
        return view[field].map((v) => { return {name: v};});
    }
    if (pickers[field]) {
        return pickers[field];
    }
    return [];
}

export default function SearchAndFilterBoats({
    sortDirection,
    sortField,
    boatsPerPage,
    filters,
    view = {},
    pickers,
    onFilterChange,
    onPageSizeChange,
    onSortChange,
    onMarkedOnly,
    haveMarks,
    isMarkedOnly,
}) {
    const classes = useStyles();
    const dateRange = [
        filters.firstYear || yearProps.min, 
        filters.lastYear || yearProps.max
    ];
    const [dr, setDr] = useState(dateRange);

    const handlePageSizeChange = (_, bpp) => {
        onPageSizeChange(parseInt(bpp,10));
    };

    function pl(id, value) {
        if (value) {
            onFilterChange({ ...filters, [id]: value });
        } else {
            const f = {...filters};
            delete f[id];
            onFilterChange(f);
        }
    }

    function o(event) {
        console.log('oga no', event.target.value);
        if (event.target.value === '') {
            const { oga_no, ...f } = filters;
            onFilterChange(f);
        } else {
            onFilterChange({ ...filters, oga_no: parseInt(event.target.value, 10) });
        }
    }

    function handleDateRange(event, newValue) {
        setDr(newValue);
    }

    function handleDateRangeCommitted(event, [min, max]) {
        const f = { ...filters };
        if (min === yearProps.min) {
            delete f.firstYear
        } else {
            f.firstYear = min;
        }
        if (max === yearProps.max) {
            delete f.lastYear
        } else {
            f.lastYear = max;
        }
        onFilterChange(f);
    }

    const sortOptions = [
        { field: 'name', name: "Name", direction: 'asc' },
        { field: 'oga_no', name: "OGA No.", direction: 'asc' },
        { field: 'year', name: "Age", direction: 'asc' },
        { field: 'updated_at', name: "Updated", direction: 'desc' },
        { field: 'length_on_deck', name: "Length", direction: 'desc' },
        { field: 'rank', name: "Editor's choice", direction: 'asc' },
     ];
     if (view.sale) {
        sortOptions.push({ field: 'price', name: "Price", direction: 'desc' });
     }
    const sortLabelByField = sortOptions.reduce((r, { field, name}) => { r[field]=name; return r;}, {});
    const sortDirectionByField = sortOptions.reduce((r, { field, direction}) => { r[field]=direction; return r;}, {});

    function handleSortFieldChange(event) {
        const field = event.target.value;
        if (field !== sortField) {
            const normal = sortDirectionByField[field];
                onSortChange(field, normal);
        } 
    }

    function handleSortDirectionChange(event) {
        const normal = sortDirectionByField[sortField];
        const dir = event.target.checked ? opposite[normal] : normal;
        if (dir !== sortDirection) {
            onSortChange(sortField, dir);
        } 
    }

    function handleOnlyMarkedChange(event) {
        onMarkedOnly(event.target.checked);
    }
    
    return (
    <form className={classes.root}>
        <p></p>
        <Divider/>
        <FormHelperText>Use these controls to sort the list by name, price, etc. and to choose how much you want to see</FormHelperText>
        <Grid container direction="row" >
            <Picker clearable={false} value={`${boatsPerPage}`} id="page-size" onChange={handlePageSizeChange} options={pageSize} label="Boats Per Page"/>
            <FormControl>
                <FormLabel>Sort By</FormLabel>
                <RadioGroup row aria-label="sorting" name="sorting" value={sortLabelByField[sortField]} onChange={handleSortFieldChange}>
                    {sortOptions.map(option => (
                        <FormControlLabel key={option.name} value={option.field} control={<Radio checked={sortField===option.field}/>} label={option.name} />
                    ))}
                </RadioGroup>
            </FormControl>
            <FormControlLabel id="sort-direction" onChange={handleSortDirectionChange}
                control={<Switch checked={sortDirection!==sortDirectionByField[sortField]} />} 
                label="reversed"
            />
        </Grid>
        <Divider/>
        <FormHelperText>Use these controls to filter the list in one or more ways</FormHelperText>
        <Grid container direction="row" justify="space-between" alignItems="stretch" >

            {haveMarks?
            <FormControlLabel id="marked" onChange={handleOnlyMarkedChange}
                control={<Switch checked={isMarkedOnly} />} 
                label="Only My Marked Boats"
            />:''
            }

            <Picker onChange={pl} id="name" options={makePicklist(view, pickers, 'boatNames')} label="Boat Name" value={filters['name']} />
            <TextField onChange={o} id="oga_no" label="OGA Boat No." variant="outlined" value={filters['oga_no']} />
            <Picker onChange={pl} id='designer' options={makePicklist(view, pickers, 'designer')} label="Designer" value={filters['designer']} />
            <Picker onChange={pl} id='builder' options={makePicklist(view, pickers, 'builder')} label="Builder" value={filters['builder']} />
            <Box sx={{ paddingLeft: 6, paddingRight: 15, width: 250 }}>
                <Typography align="center" id="date-slider" gutterBottom>
                    Built Between: {dateRange[0]} and {dateRange[1]}
                </Typography>
                <Slider
                    getAriaLabel={() => 'Date Range'}
                    value={dr}
                    onChange={handleDateRange}
                    onChangeCommitted={handleDateRangeCommitted}
                    valueLabelDisplay="auto"
                    min={yearProps.min}
                    max={yearProps.max}
                    step={yearProps.step}
                />
            </Box>
            <Picker onChange={pl} id='rig_type' options={makePicklist(view, pickers, 'rig_type')} label="Rig Type" value={filters['rig_type']} />
            <Picker onChange={pl} id='mainsail_type' options={makePicklist(view, pickers, 'sail_type')} label="Mainsail Type" value={filters['mainsail_type']}/>
            <Picker onChange={pl} id='generic_type' options={makePicklist(view, pickers, 'generic_type')} label="Generic Type" value={filters['generic_type']}/>
            <Picker onChange={pl} id='design_class' options={makePicklist(view, pickers, 'design_class')} label="Design Class" value={filters['design_class']}/>
            <Picker onChange={pl} id='construction_material' options={makePicklist(view, pickers, 'construction_material')} label="Construction Material" value={filters['construction_material']} />
        </Grid>
    </form>
    );
}
