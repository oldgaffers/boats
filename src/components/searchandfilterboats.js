import React, { useState, useEffect } from 'react'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { FormControlLabel, Grid, Switch, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Picker from './picker'

 const sortLabelByField = {
    name: "Boat Name",
    oga_no: "OGA No.",
    year: "Year Built",
    updated_at: "Last Updated",
    price: "Price",
 };

const sortLabels = Object.entries(sortLabelByField).map(([key, value]) => ({name: value}));

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

export function makeBoatNameList(boat) {
  const currentBoatNames = boat.map((b) => (b.name));
  const previousBoatNames = boat.map((b) => b.previous_names).flat();
  const setOfBoats = new Set([...currentBoatNames, ...previousBoatNames]);
  const allBoatNames = [...setOfBoats].filter((name) => name);
  allBoatNames.sort((a, b) => (a.toLowerCase().localeCompare(b.toLowerCase())));
  if (allBoatNames[0] === '') allBoatNames.shift();
  return allBoatNames.map((n) => ({ name: n, __typename: 'boat' }));
}

export default function SearchAndFilterBoats({
    sortDirection,
    sortField,
    boatsPerPage,
    filters,
    onFilterChange,
    onPageSizeChange,
    onSortFieldChange,
    onSortDirectionChange,
}) {
    const classes = useStyles();
    const [names, setNames] = useState({
        'boat-name': '',
        'designer-name': '',
        'builder-name': '',
        'rig-type-name': '',
        'mainsail-type-name': '',
        'generic-type-name': '',
        'design-class-name': '',
        'construction-material-name': '',
    });
    const [ogaNo, setOgaNo] = useState();
    const [year, setYear] = useState((filters && filters.year) ? filters.year : { firstYear: 1800, lastYear: new Date().getFullYear() });
    
    function update() {        
        const f = { ogaNo, year };
        Object.entries(names).forEach(([key, value]) => {
            if (value !== '') {
                f[key] = value; 
            }
        });
        console.log('updateFilters', f);
        if(onFilterChange) onFilterChange(f);
    }

    useEffect(update, [names, ogaNo, year]);

    const { loading, error, data } = useQuery(gql(`{
        boat{name previous_names}
        designer(order_by: {name: asc}){name}
        builder(order_by: {name: asc}){name}
        rig_type(order_by: {name: asc}){name}
        sail_type(order_by: {name: asc}){name}
        design_class(order_by: {name: asc}){name}
        generic_type(order_by: {name: asc}){name}
        construction_material(order_by: {name: asc}){name}
    }`));

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(SearchAndFilterBoats)</p>;

    const { boat, designer, builder, rig_type, sail_type, design_class, generic_type, construction_material } = data;

    const boatNames = makeBoatNameList(boat);

    function sw(event, val) {
        if (event.target.id) {
            const n = names;
            n[event.target.id] = val;
            setNames(n);
            update(); 
        }
    }

    function pl(id, value) {
        console.log('pl', id, value);
        const n = names;
        n[id] = value;
        setNames(n);
        update(); 
    }

    function o(event) {
        setOgaNo(event.target.value);
        update(); 
    }

    function sy(event) {
        console.log('sy', event);
        const { id, value } = event.target;
        if (value.length === 4) {
            const y = year;
            y[id] = value;
            setYear(y);    
            update(); 
        }
    }

    function handleSortFieldChange(id, value) {
        const map = {
            "Boat Name": 'name',
            "OGA No.": 'oga_no',
            "Year Built": 'year',
            "Last Updated": 'updated_at',
            "Price": 'price',
         };
         console.log('handleSortFieldChange', value, map[value], map);
         onSortFieldChange(map[value]);
    }

    return (
    <form className={classes.root}>
        <Grid container direction="row" justify="center" alignItems="center" >
            <Picker onChange={pl} id="boat-name" options={boatNames} label="Boat Name" value={names['boat-name']} />
            <TextField onChange={o} id="oga-no" label="OGA Boat No." variant="outlined" value={ogaNo?ogaNo:''} />
            <Picker onChange={pl} id="designer-name" options={designer} label="Designer" value={names['designer-name']} />
            <Picker onChange={pl} id="builder-name" options={builder} label="Builder" value={names['builder-name']} />
            <TextField onChange={sy} id="firstYear" label="Built After" variant="outlined"
                min={filters.year.firstYear} max={filters.year.lastYear} value={filters.year.firstYear}
            />
            <TextField onChange={sy} id="lastYear" label="Built Before" variant="outlined"
                min={filters.year.firstYear} max={filters.year.lastYear} value={filters.year.lastYear}
            />
            <Picker onChange={pl} id="rig-type" options={rig_type} label="Rig Type" value={names['rig-type-name']}/>
            <Picker onChange={pl} id="mainsail-type" options={sail_type} label="Mainsail Type" value={names['mainsail-type-name']}/>
            <Picker onChange={pl} id="generic-type" options={generic_type} label="Generic Type" value={names['generic-type-name']}/>
            <Picker onChange={pl} id="design-class" options={design_class} label="Design Class" value={names['design-class-name']}/>
            <Picker onChange={pl} id="construction-material" options={construction_material} label="Construction Material" value={names['construction-material-name']}/>
            <FormControlLabel control={<Switch id="nopics" onChange={sw} checked={!!filters.nopics} />} label="include boats without pictures"  />
            <FormControlLabel control={<Switch id="sale" onChange={sw} checked={!!filters.sale} />} label="only boats for sale"/>
            <Picker clearable={false} value={sortLabelByField[sortField]} id="sort-field" onChange={handleSortFieldChange} options={sortLabels} label="Sort By" defaultValue={'Boat Name'} />
            <FormControlLabel id="sort-direction" onChange={onSortDirectionChange} control={<Switch checked={sortDirection==='desc'} />} label="reversed" />
            <Picker clearable={false} value={boatsPerPage} id="page-size" onChange={onPageSizeChange} options={pageSize} label="Boats Per Page" defaultValue={boatsPerPage} />
        </Grid>
    </form>
    );
}
