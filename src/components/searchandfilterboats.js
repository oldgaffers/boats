import React, { useState } from 'react'
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

function SearchAndFilterBoats({
    onFilterChange,
    onPageSizeChange,
    onSortFieldChange,
    onSortDirectionChange,
    after=1800,
    until=(new Date()).getFullYear() + 1,
}) {
    const classes = useStyles();

    const [names, setNames] = useState({});
    const [ogaNo, setOgaNo] = useState();
    const [year, setYear] = useState({ firstYear: after, lastYear: until });

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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(SearchAndFilterBoats)</p>;

    const { boat, designer, builder, rig_type, sail_type, design_class, generic_type, construction_material } = data;

    const currentBoatNames = boat.map((b) => (b.name));
    const previousBoatNames = boat.map((b) => b.previous_names).flat();
    const setOfBoats = new Set([...currentBoatNames, ...previousBoatNames]);
    const allBoatNames = [...setOfBoats];
    allBoatNames.sort((a, b) => (a.toLowerCase().localeCompare(b.toLowerCase())));
    if (allBoatNames[0] === '') allBoatNames.shift();
    const boatNames = allBoatNames.map((n) => ({ name: n, __typename: 'boat' }));

    function updateFilters() {
        onFilterChange({ ...names, ogaNo, year });
    }

    function sw(event, val) {
        const n = names;
        n[event.target.id] = val;
        setNames(n)
        updateFilters();
    }

    function pl(event, value) {
        const n = names;
        n[value.__typename] = value.name;
        setNames(n);
        updateFilters();
    }

    function o(event) {
        setOgaNo(event.target.value);
        updateFilters();
    }

    function sy(event) {
        console.log('sy', event);
        const { id, value } = event.target;
        if (value.length === 4) {
            const y = year;
            y[id] = value;
            setYear(y);    
            updateFilters();
        }
    }

    return (
    <form className={classes.root}>
        <Grid container direction="row" justify="center" alignItems="center" >
            <Picker onChange={pl} id="boat-name" options={boatNames} label="Boat Name" />
            <TextField onChange={o} id="oga-no" label="OGA Boat No." variant="outlined" />
            <Picker onChange={pl} id="designer-name" options={designer} label="Designer" />
            <Picker onChange={pl} id="builder-name" options={builder} label="Builder" />
            <TextField onChange={sy} id="firstYear" label="Built After" min={after} max="" defaultValue={after} variant="outlined" />
            <TextField onChange={sy} id="lastYear" label="Built Before" min={after} max={until} defaultValue={until} variant="outlined" />
            <Picker onChange={pl} defaultValue="Cutter" id="rig-type" options={rig_type} label="Rig Type" />
            <Picker onChange={pl} defaultValue="gaff" id="mainsail-type" options={sail_type} label="Mainsail Type" />
            <Picker onChange={pl} defaultValue="yacht" id="generic-type" options={generic_type} label="Generic Type" />
            <Picker onChange={pl} id="design-class" options={design_class} label="Design Class" />
            <Picker onChange={pl} defaultValue="wood" id="construction-material" options={construction_material} label="Construction Material" />
            <FormControlLabel control={<Switch id="nopics" onChange={sw} />} label="include boats without pictures" />
            <FormControlLabel control={<Switch id="sale" onChange={sw} />} label="only boats for sale" />
            <Picker defaultValue="name" id="sort-field" onChange={onSortFieldChange} options={sortFields} label="Sort By" />
            <FormControlLabel id="sort-direction" onChange={onSortDirectionChange} control={<Switch />} label="reversed" />
            <Picker defaultValue="6" id="page-size" onChange={onPageSizeChange} options={pageSize} label="Boats Per Page" />
        </Grid>
    </form>
    );
}

export default SearchAndFilterBoats