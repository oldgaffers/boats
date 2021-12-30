import React, { useState, useEffect } from 'react'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Slider from '@mui/material/Slider';
import FormHelperText from '@mui/material/FormHelperText';
import Picker from './picker'
import useDebounce from '../util/debounce';

const opposite = { asc: 'desc', desc: 'asc' };
const yearProps = { max: new Date().getFullYear()+1, step: 10 };
yearProps.min = yearProps.max - 20*yearProps.step;

const pageSize = [];
for(let i=1; i<=8; i++) {
    pageSize.push({name: `${6*i}` });
}

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
    const [ogaNo, setOgaNo] = useState(`${filters.oga_no || ''}`);
  
    const debouncedOgaNo = useDebounce(ogaNo, 1000);
  
    useEffect(
      () => {
        if (debouncedOgaNo) {
            console.log('debounced oga no', debouncedOgaNo);
            if (debouncedOgaNo === '') {
                const { oga_no, ...f } = filters;
                onFilterChange(f);
            } else {
                console.log('new', debouncedOgaNo, 'old', filters.oga_no);
                const newNo = parseInt(debouncedOgaNo, 10);
                if (newNo !== filters.oga_no) {
                    onFilterChange({ ...filters, oga_no: newNo });
                }
            }    
        }
      },
      [debouncedOgaNo, filters, onFilterChange]
    );

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
    <form>        
        <FormHelperText sx={{marginLeft: '1em', marginBottom: '3px'}}>Use these controls to sort the list by name, price, etc. and to choose how much you want to see</FormHelperText>
        <Grid container direction="row" justify="space-evenly" alignItems="flex-end">
            <Grid>
            <Picker clearable={false} value={`${boatsPerPage}`} id="page-size" onChange={handlePageSizeChange} options={pageSize} label="Boats Per Page"/>
            </Grid>
            <Grid>
            <FormControl sx={{marginLeft: '1.5em'}}>
                <FormLabel>Sort By</FormLabel>
                <RadioGroup row aria-label="sorting" name="sorting" value={sortLabelByField[sortField]} onChange={handleSortFieldChange}>
                    {sortOptions.map(option => (
                        <FormControlLabel key={option.name} value={option.field}
                        sx={{marginRight: '1em', borderRightWidth: '1vw'}}
                        control={<Radio checked={sortField===option.field}/>} label={option.name}
                        />
                        )
                    )}
                </RadioGroup>
            </FormControl>
            </Grid>
            <Grid>
            <FormControl sx={{marginLeft: '1.5em'}}>
                <FormLabel>Sort Direction</FormLabel>
            <FormControlLabel id="sort-direction" onChange={handleSortDirectionChange}
                control={<Switch checked={sortDirection!==sortDirectionByField[sortField]} />} 
                label="reversed"
            />
            </FormControl>
            </Grid>
        </Grid>
        <Divider/>
        <FormHelperText sx={{marginLeft: '1em', marginBottom: '3px'}}>Use these controls to filter the list in one or more ways</FormHelperText>
        <Grid container direction="row" justify="space-evenly" alignItems="baseline">
        <Grid>
            {haveMarks ?
            <FormControlLabel id="marked" onChange={handleOnlyMarkedChange}
                control={<Switch checked={isMarkedOnly} />} 
                label="Only My Marked Boats"
            />:''
            }
            </Grid>
            <Grid>
            <Picker onChange={pl} id="name" options={makePicklist(view, pickers, 'boatNames')} label="Boat Name" value={filters['name']} />
            </Grid>
            <Grid>
            <Autocomplete
                 sx={{boxSizing: 'content-box'}}
                id="oga_no"
                value={ogaNo}
                freeSolo
                onInputChange={(event, value, reason)=>{
                    if (reason === 'input') {
                        setOgaNo(value);
                    }
                    if (reason === 'clear') {
                        const { oga_no, ...f } = filters;
                        if (oga_no) {
                            onFilterChange(f);
                        }
                    }
                }}
                options={[]}
                renderInput={(params) => <TextField 
                    sx={{marginTop: '3px', marginLeft: '15px', marginRight: '15px', borderRightWidth: '10px',
                width: '100%'}}
                    {...params} label="OGA Boat No." variant="outlined" />}
            />
            </Grid>
            <Grid>
            <Picker onChange={pl} id='designer' options={makePicklist(view, pickers, 'designer')} label="Designer" value={filters['designer']} />
            </Grid>
            <Grid>
            <Picker onChange={pl} id='builder' options={makePicklist(view, pickers, 'builder')} label="Builder" value={filters['builder']} />
            </Grid>
            <Grid>
            <Box sx={{ paddingLeft: 5, paddingRight: 5, width: 250 }}>
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
            </Grid>
            <Grid>
            <Picker onChange={pl} id='rig_type' options={makePicklist(view, pickers, 'rig_type')} label="Rig Type" value={filters['rig_type']} />
            </Grid>
            <Grid>
                <Picker onChange={pl} id='mainsail_type' options={makePicklist(view, pickers, 'sail_type')} label="Mainsail Type" value={filters['mainsail_type']}/>
            </Grid>
            <Grid>
            <Picker onChange={pl} id='generic_type' options={makePicklist(view, pickers, 'generic_type')} label="Generic Type" value={filters['generic_type']}/>
            </Grid>
            <Grid>
                <Picker onChange={pl} id='design_class' options={makePicklist(view, pickers, 'design_class')} label="Design Class" value={filters['design_class']}/>
            </Grid>
            <Grid>
            <Picker onChange={pl} id='construction_material' options={makePicklist(view, pickers, 'construction_material')} label="Construction Material" value={filters['construction_material']} />
        </Grid>
        </Grid>
    </form>
    );
}
