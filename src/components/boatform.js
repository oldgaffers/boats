import React, { useState, isValidElement, cloneElement } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Publish from '@material-ui/icons/Publish';
import { RadioList } from './radiolist';
import ReallyDumbRTE from './ReallyDumbRTE';
import Picker from './picker';
import Grid from '@material-ui/core/Grid';

function Field({ name, state, onChange, as, ...props }) {

  const key = name || props.label.replace(/ /g, '_').toLowerCase();

  function handleChange(event) {
    if (onChange) {
      onChange({...state, [key]: event.target.value});
    }
  }

  return (
    <TextField {...props} fullWidth
    variant="outlined" name={key} value={state[key]} onChange={handleChange} />
  );
}

function ArrayField({ name, field, state, onChange, as, ...props }) {

  function handleChange(event) {
    if (onChange) {
      const a = event.target.value.split(/, */);
      onChange({...state, [field]: a});
    }
  }

  const value=state[field]?state[field].join(', '):''

  return (
    <TextField {...props} fullWidth
    variant="outlined" name={field} value={value} onChange={handleChange} />
  );
}

function HandicapField({ name, state, onChange, as, ...props }) {
  
    function handleChange(event) {
      if (onChange) {
        const { handicap_data } = state;
        handicap_data[name] = event.target.value;
        onChange({...state, handicap_data});
      }
    }

    if (as) {
        if (isValidElement(as)) {
            return cloneElement(as, {
                ...props, value: state.handicap_data[name], onChange: handleChange
            });
        }
    }
  
    return (
      <TextField {...props} fullWidth
      variant="outlined" name={name} value={state.handicap_data[name]} onChange={handleChange} />
    );
  }

function Sail({ label, fields, state, onChange }) {

    function n(prefix, suffix) {
        const r = `${prefix}_${suffix}`.replace(/ /g, '_').toLowerCase();
        console.log(r);
        return r;
    }

    return (
      <>
        <Typography>{label}</Typography>
        {fields.map((field) => (
          <Field
            name={n(label, field)}
            label={field}
            type="number"
            state={state}
            onChange={onChange}
          />
        ))}
      </>
    );
}

function getStepContent(step, props) {
  const { currentState, pickers, onChange, onPickerChange, onClose } = props;
  switch (step) {
    case 0:
      return (
        <>
        <Typography>Thanks. Please give us an email address or phone number so we can contact you.
          <p>If we can't contact you, we will still review the data and if we can independently verify it,
          we will still use it on the register.</p>
        </Typography>        
        <TextField id="contact002" fullWidth variant="outlined" name="contact" value="" onChange={onChange} />
        </>
      );
    case 1:
      return (
        <ArrayField
          state={currentState}
          field="previous_names"
          onChange={onChange}
          label="Previous names"
        />
      );
    case 2: return (
      <>
          <Picker onChange={onPickerChange} options={pickers.design_class} label="Design Class" value={
            currentState.designClassByDesignClass
            ?currentState.designClassByDesignClass.name
            :'One off'
          }/>
          <Typography>&nbsp;</Typography>
          <Picker onChange={onPickerChange} options={pickers.generic_type} label="Generic Type" value={currentState.generic_type}/> 
          </>
      );
    case 3: return (
        <Picker onChange={onPickerChange} options={pickers.sail_type} label="Mainsail Type" value={currentState.mainsail_type}/>
        );
    case 4: return (
        <Picker onChange={onPickerChange} options={pickers.rig_type} label="Rig Type" value={currentState.rigTypeByRigType?currentState.rigTypeByRigType.name:''}/>
        );
    case 5: return (
        <Picker onChange={onPickerChange} options={pickers.designer} label="Designer" value={currentState.designerByDesigner?currentState.designerByDesigner.name:''} />
      );
    case 6: return (
        <>
        <Typography>Basic hull measurements</Typography>
        <Field
          state={currentState}
          onChange={onChange}
          type="number"
          label="Length on Deck"
        />
        <Field
          state={currentState}
          onChange={onChange}
          type="number"
          label="Draft"
        />
        </>
        );
    case 7: return (
      <>      
        <Typography>Measurement Diagram</Typography>
        <img alt="measurement diagram" src="hull-measurements.png" />
      </>
    );
    case 8: return (
          <>
        <Typography>Hull measurements</Typography>
        <HandicapField
          name='length_over_spars'
          label="Length over spars"
          state={currentState}
          onChange={onChange}
          type="number"
        />
        <HandicapField
          name='length_on_waterline'
          label="Length on the waterline"
          state={currentState}
          onChange={onChange}
          type="number"
          onCancel={onClose}
        />
        <HandicapField
          name='beam'
          label="Beam"
          state={currentState}
          onChange={onChange}
          type="number"
        />
        <HandicapField
          name='depth'
          label="Depth"
          state={currentState}
          onChange={onChange}
          type="number"
        />
      </>
    );
    case 9: return (
        <Sail
          state={currentState}
          onChange={onChange}
          label="Biggest Staysail"
          fields={['Luff', 'Leach', 'Foot']}
        />
    );
    case 10: return (
        <Sail
          state={currentState}
          onChange={onChange}
          label="Biggest Jib"
          fields={['Luff', 'Leach', 'Foot']}
    />
    );
    case 11: return (
        <Sail
          state={currentState}
          onChange={onChange}
          label="Biggest Downwind Sail"
          fields={['Luff', 'Leach', 'Foot']}
        />
    );
    case 12: return (
        <Sail
          state={currentState}
          onChange={onChange}
          label="Main Sail"
          fields={['Luff', 'Head', 'Foot']}
        />
    );
    case 13: return (
        <Sail
          state={currentState}
          onChange={onChange}
          label="Top Sail"
          fields={['Luff', 'Perpendicular']}
        />
    );
    case 14: return (
        <Sail
          state={currentState}
          onChange={onChange}
          label="Mizen"
          fields={['Luff', 'Head', 'Foot']}
        />
    );
    case 15: return (
        <Sail
          state={currentState}
          onChange={onChange}
          label="Mizen Topsail"
          fields={['Luff', 'Perpendicular']}
        />
    );
    case 16: return (
      <>
        <Typography>Propellor type</Typography>
        <HandicapField as={<RadioList/>}
          name="propellor"
          state={currentState}
          onChange={onChange}
          options={['None', 'Fixed', 'Folding', 'Feathering']}
        />
      </>
    );
    case 17: return (
      <>
        <Typography>Hull type</Typography>
        <RadioList
          name="hull_form"
          state={currentState}
          onChange={onChange}
          options={pickers.hull_form}
        />
      </>
      );
      case 18: return (
        <>
        <Typography variant="h4">Construction</Typography>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <Typography>&nbsp;</Typography>
            <Picker onChange={onPickerChange} options={pickers.construction_method} label="Construction Method" value={currentState.constructionMethodByConstructionMethod?currentState.constructionMethodByConstructionMethod.name:'undefined'} />
          </Grid>
          <Grid item xs={6}>
            <Typography>&nbsp;</Typography>
            <Picker onChange={onPickerChange} options={pickers.construction_material} label="Construction Material" value={currentState.constructionMaterialByConstructionMaterial?currentState.constructionMaterialByConstructionMaterial.name:'undefined'} />
          </Grid>
          <Grid item xs={6}>
            <Typography>&nbsp;</Typography>
            <Picker onChange={onPickerChange} options={pickers.spar_material} label="Spar Material" value={currentState.spar_material||''} />
          </Grid>
          <Grid item xs={6}>
            <Typography>&nbsp;</Typography>
            <Field
              state={currentState}
              onChange={onChange}
              type="text"
              label="construction_details"
            />
          </Grid>
        </Grid>
        </>
        );
    case 19: return (      
      <>
        <Typography variant="h4">Where and when built</Typography>
        <Field state={currentState} onChange={onChange} label="Year" />
        <Typography>&nbsp;</Typography>
        <Picker onChange={onPickerChange} options={pickers.builder} label="Builder" value={currentState.builderByBuilder?currentState.builderByBuilder.name:''} />
      </>
    );
    case 20: return (
      <>
      <Typography variant="h4">Short description</Typography>
        <ReallyDumbRTE
          value={currentState.short_description}
          name="short_description"
          state={currentState}
          onSave={onChange}
        />
        </>
    );
    case 21: return (
      <>
        <Typography variant="h4">Location</Typography>        
        <Picker onChange={onPickerChange} options={['UK', 'Ireland', 'France', 'Netherlands', 'Belgium']} label="Home Country" value={currentState.home_country}/>
        <Field name="home_port" label="Home Port" state={currentState} onChange={onChange} />
      </>
    );
    case 22: return (
      <>
        <Typography variant="h4">Part 1 British Registry Details</Typography>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <Field
              name="uk_part1"
              label="Official Registry Number"
              state={currentState}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              state={currentState}
              onChange={onChange}
              label="Port of Registry"
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              state={currentState}
              onChange={onChange}
              type="number"
              label="Year Registered"
            />
          </Grid>
        </Grid>
      </>
    );
    case 23: return (
      <>
        <Typography variant="h4">Other Registrations</Typography>
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <Field name="ssr" label="SSR" state={currentState} onChange={onChange} />
          </Grid>
          <Grid item xs={3}>
            <Field name="call_sign" label="VHF Call Sign" state={currentState} onChange={onChange} />
          </Grid>
          <Grid item xs={3}>
            <Field name="nhsr" label="National Register of Historic Vessels Number" state={currentState} onChange={onChange} />
          </Grid>
          <Grid item xs={3}>
            <Field name="nhbr" label="National Small Boats Register Number" state={currentState} onChange={onChange} />
          </Grid>
          <Grid item xs={3}>
            <Field name="fishing_number" label="Fishing Number" state={currentState} onChange={onChange} />
          </Grid>
          <Grid item xs={3}>
            <Field name="sail_number" label="Sail Number" state={currentState} onChange={onChange} />
          </Grid>
          <Grid item xs={3}>
            <Field name="mssi" label="MSSI" state={currentState} onChange={onChange} />
          </Grid>
          <Grid item xs={3}>
            <Field name="WIN" label="WIN" state={currentState} onChange={onChange} />
            </Grid>
          <Grid item xs={12}>
            <Field name="other_registrations" label="Others" state={currentState} onChange={onChange} />
          </Grid>
        </Grid>
        </>
        );
    case 24: return (
        <>
        <Typography variant="h4">Full description</Typography>
        <ReallyDumbRTE
          value={currentState.full_description}
          state={currentState}
          onSave={onChange}
        />
        </>
    );
    case 25: return (
      <>
      <Typography>
        We're done! Thanks so much!<p>The editor's will review your input. 
        If we have any questions we will get back to you by email.</p>
        <p>We'll let you know when your input is live on the site.</p>
        </Typography>
      </>
  );
  default: return null;
}
}


/*
<Question>
        <Typography>Engine</Typography>
        <RadioList
          name="engine"
          state={currentState}
          onChange={onChange}
          options={['None', 'Inboard', 'Outboard']}
        />
      </Question>
*/

const classes = {};
const theme = {};

export default function BoatForm({ state, onChange, onSubmit, onClose, pickers }) {
  const [currentState, setCurrentState] = useState(state);
  const [activeStep, setActiveStep] = useState(0);

  function onPickerChange(id, val) {
   console.log('picker change', id, val);
   setCurrentState({...currentState, [id]: val });
  }

  function handleNext() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  function handleBack() {    
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  const steps=26;

  const next = () => {
    return (
      <Button size="small" onClick={handleNext}>
        Next
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </Button>
    );
  }

  const done = () => {
    return (
      <Button size="small" onClick={onSubmit}>
        Submit
        <Publish />
      </Button>
    );
  }

  return (
    <>
    {getStepContent(activeStep, {
      onPickerChange,
      currentState,
      pickers,
      onChange, 
      onClose,
      onSubmit,
    })}
    <MobileStepper
    variant="progress"
    steps={steps}
    position="static"
    activeStep={activeStep}
    className={classes.root}
    nextButton={((activeStep+1)===steps)?done():next()}
    backButton={
      <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        Back
      </Button>
    }
    />
    </>
    );
}

