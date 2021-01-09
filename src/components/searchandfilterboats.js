import React from 'react'
import Divider from '@material-ui/core/Divider'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Picker from './picker'

const opposite = { asc: 'desc', desc: 'asc' };

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

export default function SearchAndFilterBoats({
    sortDirection,
    sortField,
    boatsPerPage,
    filters={ sale: false },
    onFilterChange,
    onPageSizeChange,
    onSortChange=(x) => console.log(x),
    pickers,
}) {
    const classes = useStyles();

    function pl(id, value) {
        console.log('picker change', id, value)
        onFilterChange({ ...filters, [id]: value });
    }

    function o(event) {
        onFilterChange({ ...filters, ogaNo: event.target.value });
    }

    function sy(event) {
        const { id, value } = event.target;
        const year = { ...filters.year };
        console.log('sy', id, value, year);
        if (value.length === 4) {
            year[id] = parseInt(value);
            onFilterChange({ ...filters, year });
        } else if (value === '') {
            delete year[id];
            onFilterChange({ ...filters, year });
        } else {
            console.log('unchanged', year);
        }
    }

    const sortOptions = [
        { field: 'name', name: "Name", direction: 'asc' },
        { field: 'oga_no', name: "OGA No.", direction: 'asc' },
        { field: 'year', name: "Age", direction: 'asc' },
        { field: 'updated_at', name: "Updated", direction: 'desc' },
        { field: 'editors_choice', name: "Editor's choice", direction: 'asc' },
     ];
     if (filters && filters.sale) {
        sortOptions.push({ field: 'price', name: "Price", direction: 'desc' });
     }
    const sortLabelByField = sortOptions.reduce((r, { field, name}) => { r[field]=name; return r;}, {});
    const sortDirectionByField = sortOptions.reduce((r, { field, direction}) => { r[field]=direction; return r;}, {});

    function handleSortFieldChange(event) {
        console.log('handleSortFieldChange', event.target.value);
        const field = event.target.value;
        if (field !== sortField) {
            const normal = sortDirectionByField[field];
            console.log('handleSortFieldChange', field, normal);
                onSortChange(field, normal);
        } 
    }

    function handleSortDirectionChange(event) {
        const normal = sortDirectionByField[sortField];
        const dir = event.target.checked ? opposite[normal] : normal;
        if (dir !== sortDirection) {
            console.log('handleSortDirectionChange', dir);
            onSortChange(sortField, dir);
        } 
    }

    const yearProps = { min: "1800", max: `${new Date().getFullYear()+1}`, step: "10" };

    return (
    <form className={classes.root}>
        <p></p>
        <Divider/>
        <FormHelperText>Use these controls to sort the list by name, price, etc. and to choose how much you want to see</FormHelperText>
        <Grid container direction="row" >
            <Picker clearable={false} value={boatsPerPage} id="page-size" onChange={onPageSizeChange} options={pageSize} label="Boats Per Page"/>
            <FormControl>
                <FormLabel>Sort By</FormLabel>
                <RadioGroup row aria-label="sorting" name="sorting" value={sortLabelByField[sortField]} onChange={handleSortFieldChange}>
                    {sortOptions.map(option => (
                        <FormControlLabel value={option.field} control={<Radio checked={sortField===option.field}/>} label={option.name} />
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
            <Picker onChange={pl} id="boat-name" options={pickers.boatNames} label="Boat Name" value={filters['boat-name']} />
            <TextField onChange={o} id="ogaNo" label="OGA Boat No." variant="outlined" value={filters['ogaNo']} />
            <Picker onChange={pl} id='designer' options={pickers.designer} label="Designer" value={filters['designer']} />
            <Picker onChange={pl} id='builder' options={pickers.builder} label="Builder" value={filters['builder']} />
            <TextField onChange={sy} id="firstYear" label="Built After" variant="outlined"
                type="number" inputProps={yearProps} 
            />
            <TextField onChange={sy} id="lastYear" label="Built Before" variant="outlined"
                type="number" inputProps={yearProps} 
            />
            <Picker onChange={pl} id='rig_type' options={pickers.rig_type} label="Rig Type" value={filters['rig-type']}/>
            <Picker onChange={pl} id='sail_type' options={pickers.sail_type} label="Mainsail Type" value={filters['mainsail_type']}/>
            <Picker onChange={pl} id='generic_type' options={pickers.generic_type} label="Generic Type" value={filters['generic_type']}/>
            <Picker onChange={pl} id='design_class' options={pickers.design_class} label="Design Class" value={filters['design_class']}/>
            <Picker onChange={pl} id='construction_material' options={pickers.construction_material} label="Construction Material" value={filters['construction_material']} />
        </Grid>
    </form>
    );
}
