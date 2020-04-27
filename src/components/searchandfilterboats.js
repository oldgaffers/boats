import React from 'react'
import { FormControlLabel, Grid, Switch, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { sampleBoatNames, sampleBuilderNames, 
    sampleDesignClasses, sampleDesignerNames, sampleGenericTypes, 
    sampleMainsailTypes, sampleRigTypes, sampleMaterials }
    from '../mock/sampledata'
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

function SearchAndFilterBoats({ onPageSizeChange, onSortFieldChange, onSortDirectionChange }) {
    const classes = useStyles();
    const now = (new Date()).getFullYear() + 1;

    return (
    <form className={classes.root}>
        <Grid container direction="row" justify="center" alignItems="center" >
            <Picker id="boat-name" options={sampleBoatNames} label="Boat Name (incl. previous names)" />
            <TextField id="oga-no" label="OGA Boat No." variant="outlined" />
            <Picker id="designer-name" options={sampleDesignerNames} label="Designer" />
            <Picker id="builder-name" options={sampleBuilderNames} label="Builder" />
            <TextField id="year-first" label="Built After" min="1800" max="" defaultValue="1800" variant="outlined" />
            <TextField id="year-last" label="Built Before" min="1800" max={now} defaultValue={now} variant="outlined" />
            <Picker id="rig-type" options={sampleRigTypes} label="Rig Type" />
            <Picker id="mainsail-type" options={sampleMainsailTypes} label="Mainsail Type" />
            <Picker id="generic-type" options={sampleGenericTypes} label="Generic Type" />
            <Picker id="design-class" options={sampleDesignClasses} label="Design Class" />
            <Picker id="construction-material" options={sampleMaterials} label="Construction Material" />
            <FormControlLabel control={<Switch />} label="include boats without pictures" />
            <FormControlLabel control={<Switch />} label="only boats for sale" />
            <Picker id="sort-field" onChange={onSortFieldChange} options={sortFields} label="Sort By" />
            <FormControlLabel id="sort-direction" onChange={onSortDirectionChange} control={<Switch />} label="reversed" />
            <Picker id="page-size" onChange={onPageSizeChange} options={pageSize} label="Boats Per Page" />
        </Grid>
    </form>
    );
}

export default SearchAndFilterBoats