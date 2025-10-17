import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';

export function RadioList({ options, name, state, onChange }) {

    function handleChange(event) {
      if (onChange) {
        const s = state;
        s[name] = event.target.value;
        onChange(s);
      }
    }
  
    let value;
    if(state && state[name]) value = state[name].toLowerCase();
  
    return (
        <FormControl component="fieldset">
        <RadioGroup row name={name} value={value} onChange={handleChange}>
          <Grid container>
          {
            options.map((option) => {
              const v = option.replace(/ /g, '_').toLowerCase();
              return (<Grid key={`${name}.${v}`} item>
                <FormControlLabel 
                value={v}
                control={<Radio />} 
                label={option} 
                />
              </Grid>)
            })
          }
          </Grid>
        </RadioGroup>
      </FormControl>
    );
}