import React from 'react'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { FormControlLabel, Grid, Switch, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Picker from './picker'

const sortFields = [
    { name: "Boat Name" },
    { name: "OGA No." },
    { name: "Year Built" },
    { name: "Last Updated" },
    { name: "Price" },
];
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

function SearchAndFilterBoats({ onFilterChange, onPageSizeChange, onSortFieldChange, onSortDirectionChange }) {
    const classes = useStyles();
    const now = (new Date()).getFullYear() + 1;

    const { loading, error, data } = useQuery(gql(`{
        boat{name previous_names}
        designer{name}
        builder{name}
        rig_type {name}
        sail_type{name}
        design_class {name}
        generic_type{name}
        construction_material{name}        
    }`));

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :(SearchAndFilterBoats)</p>;
    const { boat, designer, builder, rig_type, sail_type, design_class, generic_type, construction_material } = data;

    const currentBoatNames = boat.map((b) => (b.name));
    const previousBoatNames = boat.map((b) => b.previous_names).flat();
    const setOfBoats = new Set([...currentBoatNames, ...previousBoatNames]);
    const allBoatNames = [...setOfBoats];
    allBoatNames.sort((a, b) => (a.toLowerCase().localeCompare(b.toLowerCase())));
    if (allBoatNames[0] === '') allBoatNames.shift();
    const boatNames = allBoatNames.map((n) => ({ name: n, __typename: 'boat' }));

    function sw1(event, val) {
        console.log('sw1', event, val);
        onFilterChange('pic', val);
    }

    function sw2(event, val) {
        console.log('sw2', event, val);
        onFilterChange('sale', val);
    }

    return (
    <form className={classes.root}>
        <Grid container direction="row" justify="center" alignItems="center" >
            <Picker onChange={onFilterChange} id="boat-name" options={boatNames} label="Boat Name" />
            <TextField onChange={onFilterChange} id="oga-no" label="OGA Boat No." variant="outlined" />
            <Picker onChange={onFilterChange} id="designer-name" options={designer} label="Designer" />
            <Picker onChange={onFilterChange} id="builder-name" options={builder} label="Builder" />
            <TextField onChange={onFilterChange} id="year-first" label="Built After" min="1800" max="" defaultValue="1800" variant="outlined" />
            <TextField onChange={onFilterChange} id="year-last" label="Built Before" min="1800" max={now} defaultValue={now} variant="outlined" />
            <Picker onChange={onFilterChange} defaultValue="Cutter" id="rig-type" options={rig_type} label="Rig Type" />
            <Picker onChange={onFilterChange} defaultValue="gaff" id="mainsail-type" options={sail_type} label="Mainsail Type" />
            <Picker onChange={onFilterChange} defaultValue="yacht" id="generic-type" options={generic_type} label="Generic Type" />
            <Picker onChange={onFilterChange} id="design-class" options={design_class} label="Design Class" />
            <Picker onChange={onFilterChange} defaultValue="wood" id="construction-material" options={construction_material} label="Construction Material" />
            <FormControlLabel control={<Switch onChange={sw1} />} label="include boats without pictures" />
            <FormControlLabel control={<Switch onChange={sw2} />} label="only boats for sale" />
            <Picker defaultValue="name" id="sort-field" onChange={onSortFieldChange} options={sortFields} label="Sort By" />
            <FormControlLabel id="sort-direction" onChange={onSortDirectionChange} control={<Switch />} label="reversed" />
            <Picker defaultValue="6" id="page-size" onChange={onPageSizeChange} options={pageSize} label="Boats Per Page" />
        </Grid>
    </form>
    );
}

export default SearchAndFilterBoats