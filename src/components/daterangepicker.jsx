import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

export default function DateRangePicker({
    value, label, onChange, onChangeCommitted, min, max, step,
}) {
    
  return (
    <Box
      sx={{
        position: 'relative',
        top: '4px',
        border: "1px solid lightgray",
        borderRadius: '4px',
        margin: '1em',
        paddingLeft: 2,
        paddingRight: 2,
        paddingBottom: '1px',
      }}
    >
      <Typography align="center" id="date-slider">
        {label}
      </Typography>
      <Slider
        sx={{paddingBottom: '1px'}}
        size='small'
        getAriaLabel={() => label}
        value={value}
        onChange={onChange}
        onChangeCommitted={onChangeCommitted}
        valueLabelDisplay="auto"
        min={min} max={max} step={step}
      /> 
    </Box>
  );
}
