import React, { useState, isValidElement, cloneElement } from 'react';
import { Typography, TextField } from '@material-ui/core';
import { RadioList, GqlRadioList } from './radiolist';
import { Step, JumpStep, Submit } from '../../util/formsteps';
import ReallyDumbRTE from '../../util/ReallyDumbRTE';
import GqlPicker from '../gqlpicker';
import Picker from '../picker';
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

export default function BoatForm({ 
  state, onChange, onSubmit, onClose }) {
  const [step, setStep] = useState(1);
  const [currentState, setCurrentState] = useState(state);

  let n = 1;
  const labels = {};

  function onPickerChange(id, val) {
   console.log('picker change', id, val);
   setCurrentState({...currentState, [id]: val });
  }

  function Question({ children}) {
    return (
      <Step
        step={n++}
        currentStep={step}
        onPrev={() => setStep(step - 1)}
        onNext={() => setStep(step + 1)}
        onCancel={onClose}
    >{children}</Step>
    );
  }

  function JumpLabel({label}) {
    labels[label] = n;
    return '';
  }

  function JumpQuestion({jump, jumpLabel, question}) {
      return (
      <JumpStep
        step={n++}
        currentStep={step}
        onPrev={() => setStep(step - 1)}
        onNext={() => setStep(step + 1)}
        onJump={() => setStep(labels[jump])}
        jumpLabel={jumpLabel}
        nextLabel="Yes"
        onCancel={onClose}
      >
        <Typography>{question}</Typography>
      </JumpStep>
    );
  }

  function Done({children}) {
    return (
      <Submit
        step={n++}
        currentStep={step}
        onPrev={() => setStep(step - 1)}
        onCancel={onClose}
        onSubmit={onSubmit}
      >{children}</Submit>
    );
  }

  return (
    <>
      <Question>
        <Typography>Thanks. Please give us an email address or phone number so we can contact you.
          <p>If we can't contact you, we will still review the data and if we can independently verify it,
          we will still use it on the register.</p>
        </Typography>        
        <TextField fullWidth variant="outlined" name="contact" value="" onChange={onChange} />
      </Question>
      <Question>
        <ArrayField
          state={currentState}
          field="previous_names"
          onChange={onChange}
          label="Previous names"
        />
      </Question>
      <Question>
          <GqlPicker onChange={onPickerChange} id="design_class" label="Design Class" value={
            currentState.designClassByDesignClass
            ?currentState.designClassByDesignClass.name
            :'One off'
          }/>
          <Typography>&nbsp;</Typography>
          <GqlPicker onChange={onPickerChange} id="generic_type" label="Generic Type" value={currentState.generic_type}/>                  
      </Question>
      <Question>
        <GqlPicker onChange={onPickerChange} id="sail_type" label="Mainsail Type" value={currentState.mainsail_type}/>
      </Question>
      <Question>
        <GqlPicker onChange={onPickerChange} independently="rig_type" label="Rig Type" value={currentState.rigTypeByRigType?currentState.rigTypeByRigType.name:''}/>
      </Question>      
      <Question>
        <GqlPicker onChange={onPickerChange} id="designer" label="Designer" value={currentState.designerByDesigner?currentState.designerByDesigner.name:''} />
      </Question>
      <JumpLabel label="handicap"/>
      <JumpQuestion
        question="Enter Handicapping Details"
        jumpLabel="Not Now"
        jump="afterHandicap"
      />
      <Question>
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
      </Question>
      <Question>
        <Typography>Measurement Diagram</Typography>
        <img alt="measurement diagram" src="hull-measurements.png" />
      </Question>
      <Question>
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
      </Question>
      <JumpLabel label="racingHeadsails"/>
      <JumpQuestion
        question="Do you set headsails when racing"
        jumpLabel="No"
        jump="afterRacingHeadsails"
      />
      <Question>
        <Sail
          state={currentState}
          onChange={onChange}
          label="Biggest Staysail"
          fields={['Luff', 'Leach', 'Foot']}
        />
      </Question>
      <Question>
        <Sail
          state={currentState}
          onChange={onChange}
          label="Biggest Jib"
          fields={['Luff', 'Leach', 'Foot']}
        />
      </Question>
      <Question>
        <Sail
          state={currentState}
          onChange={onChange}
          label="Biggest Downwind Sail"
          fields={['Luff', 'Leach', 'Foot']}
        />
      </Question>
      <JumpLabel label="afterRacingHeadsails"/>
      <Question>
        <Sail
          state={currentState}
          onChange={onChange}
          label="Main Sail"
          fields={['Luff', 'Head', 'Foot']}
        />
      </Question>
      <Question>
        <Sail
          state={currentState}
          onChange={onChange}
          label="Top Sail"
          fields={['Luff', 'Perpendicular']}
        />
      </Question>
      <Question>
        <Sail
          state={currentState}
          onChange={onChange}
          label="Mizen"
          fields={['Luff', 'Head', 'Foot']}
        />
      </Question>
      <Question>        
        <Sail
          state={currentState}
          onChange={onChange}
          label="Mizen Topsail"
          fields={['Luff', 'Perpendicular']}
        />
      </Question>
      <Question>
        <Typography>Propellor type</Typography>
        <HandicapField as={<RadioList/>}
          name="propellor"
          state={currentState}
          onChange={onChange}
          options={['None', 'Fixed', 'Folding', 'Feathering']}
        />
      </Question>
      <Question>
        <Typography>Hull type</Typography>
        <GqlRadioList
          name="hull_form"
          state={currentState}
          onChange={onChange}
          id="hull_form"
        />
      </Question>
      <JumpLabel label="afterHandicap"/>
      <Question>
        <Typography variant="h4"y>Construction</Typography>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <Typography>&nbsp;</Typography>
            <GqlPicker onChange={onPickerChange} id="construction_method" label="Construction Method" value={currentState.constructionMethodByConstructionMethod?currentState.constructionMethodByConstructionMethod.name:'undefined'} />
          </Grid>
          <Grid item xs={6}>
            <Typography>&nbsp;</Typography>
            <GqlPicker onChange={onPickerChange} id="construction_material" label="Construction Material" value={currentState.constructionMaterialByConstructionMaterial?currentState.constructionMaterialByConstructionMaterial.name:'undefined'} />
          </Grid>
          <Grid item xs={6}>
            <Typography>&nbsp;</Typography>
            <GqlPicker onChange={onPickerChange} id="spar_material" label="Spar Material" value={currentState.spar_material||''} />
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
      </Question>
      <Question>
        <Typography variant="h4">Where and when built</Typography>
        <Field state={currentState} onChange={onChange} label="Year" />
        <Typography>&nbsp;</Typography>
        <GqlPicker onChange={onPickerChange} id="builder" label="Builder" value={currentState.builderByBuilder?currentState.builderByBuilder.name:''} />
      </Question>
      <Question>
        <ReallyDumbRTE
          label="Short description"
          state={currentState}
          onSave={onChange}
        />
      </Question>
      <Question>
        <Typography variant="h4">Location</Typography>        
        <Picker onChange={onPickerChange} options={['UK', 'Ireland', 'France', 'Netherlands', 'Belgium']} label="Home Country" value={currentState.home_country}/>
        <Field name="home_port" label="Home Port" state={currentState} onChange={onChange} />
      </Question>
      <Question>
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
      </Question>
      <Question>
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
      </Question>
      <Question>
        <ReallyDumbRTE
          label="Full description"
          state={currentState}
          onSave={onChange}
        />
      </Question>
      <Done>
        We're done! Thanks so much!<p>The editor's will review your input. 
        If we have any questions we will get back to you by email.</p>
        <p>We'll let you know when your input is live on the site.</p>
      </Done>
    </>
  );
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