import React from 'react'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { FormControlLabel, Grid, Switch, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Picker from './picker'

 const sortLabels = [
    { field: 'name', name: "Boat Name" },
    { field: 'oga_no', name: "OGA Boat No." },
    { field: 'year', name: "Year Built" },
    { field: 'updated_at', name: "Last Updated" },
    { field: 'price', name: "Price" },
 ];

const sortFieldByLabel = sortLabels.reduce((r, { field, name}) => { r[name]=field; return r;}, {});
const sortLabelByField = sortLabels.reduce((r, { field, name}) => { r[field]=name; return r;}, {});

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

    function sw(event, value) {
        if (event.target.id) {
            onFilterChange({ ...filters, [event.target.id]: value });
        }
    }

    function pl(id, value) {
        onFilterChange({ ...filters, [id]: value });
    }

    function o(event) {
        onFilterChange({ ...filters, ogaNo: event.target.value });
    }

    function sy(event) {
        console.log('sy', event.target);
        const { id, value } = event.target;
        if (value.length === 4) {
            const year = { ...filters.year };
            year[id] = parseInt(value);
            onFilterChange({ ...filters, year });
        } else {
            console.log('year - do we ever get out of range values?', value);
        }
    }

    function handleSortFieldChange(id, value) {
        const field = sortFieldByLabel[value];
        console.log('handleSortFieldChange', value, field);
        onSortFieldChange(field);
    }

    const yearProps = { min: "1800", max: `${new Date().getFullYear()+1}`, step: "1" };

    return (
    <form className={classes.root}>
        <Grid container direction="row" justify="center" alignItems="center" >
            <Picker onChange={pl} id="boat-name" options={boatNames} label="Boat Name" value={filters['boat-name']} />
            <TextField onChange={o} id="oga-no" label="OGA Boat No." variant="outlined" value={filters['ogaNo']} />
            <Picker onChange={pl} id="designer-name" options={designer} label="Designer" value={filters['designer-name']} />
            <Picker onChange={pl} id="builder-name" options={builder} label="Builder" value={filters['builder-name']} />
            <TextField onChange={sy} id="firstYear" label="Built After" variant="outlined"
                type="number" inputProps={yearProps} defaultValue={filters.year.firstYear}
            />
            <TextField onChange={sy} id="lastYear" label="Built Before" variant="outlined"
                type="number" inputProps={yearProps} defaultValue={filters.year.lastYear+1}
            />
            <Picker onChange={pl} id="rig-type" options={rig_type} label="Rig Type" value={filters['rig-type']}/>
            <Picker onChange={pl} id="mainsail-type" options={sail_type} label="Mainsail Type" value={filters['mainsail-type']}/>
            <Picker onChange={pl} id="generic-type" options={generic_type} label="Generic Type" value={filters['generic-type']}/>
            <Picker onChange={pl} id="design-class" options={design_class} label="Design Class" value={filters['design-class']}/>
            <Picker onChange={pl} id="construction-material" options={construction_material} label="Construction Material" />
            <FormControlLabel control={<Switch id="nopics" onChange={sw} checked={!!filters.nopics} />} label="include boats without pictures"  />
            <FormControlLabel control={<Switch id="sale" onChange={sw} checked={!!filters.sale} />} label="only boats for sale"/>
            <Picker clearable={false} value={sortLabelByField[sortField]} id="sort-field" onChange={handleSortFieldChange} options={sortLabels} label="Sort By" />
            <FormControlLabel id="sort-direction" onChange={onSortDirectionChange} control={<Switch checked={sortDirection==='desc'} />} label="reversed" />
            <Picker clearable={false} value={boatsPerPage} id="page-size" onChange={onPageSizeChange} options={pageSize} label="Boats Per Page"/>
        </Grid>
    </form>
    );
}
