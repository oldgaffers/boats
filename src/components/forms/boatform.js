import React, { useState, isValidElement, cloneElement } from 'react';
import { Typography, TextField } from '@material-ui/core';
import { RadioList, GqlRadioList } from './radiolist';
import { Step, JumpStep, Submit } from '../../util/formsteps';
import ReallyDumbRTE from '../../util/ReallyDumbRTE';
import GqlPicker from '../gqlpicker';
import Picker from '../picker';

function Field({ name, state, onChange, as, ...props }) {

  const key = name || props.label.replace(/ /g, '_').toLowerCase();

  function handleChange(event) {
    if (onChange) {
      const s = state;
      s[key] = event.target.value;
      onChange(s);
    }
  }

  return (
    <TextField {...props} fullWidth
    variant="outlined" name={key} value={state[key]} onChange={handleChange} />
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

  let n = 1;
  const labels = {};

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
        <Field
          state={state}
          onChange={onChange}
          label="Previous names"
          value={state.previous_names?state.previous_names.join(', '):''}
        />
      </Question>
      <Question>
          <GqlPicker onChange={onChange} list="design_class" label="Design Class" value={
            state.designClassByDesignClass
            ?state.designClassByDesignClass.name
            :'One off'
          }/>                  
      </Question>
      <Question>
        <GqlPicker onChange={onChange} list="sail_type" label="Mainsail Type" value={state.mainsail_type}/>
      </Question>
      <Question>
        <GqlPicker onChange={onChange} list="rig_type" label="Rig Type" value={state.rigTypeByRigType?state.rigTypeByRigType.name:''}/>
      </Question>      
      <Question>
        <GqlPicker onChange={onChange} list="designer" label="Designer" value={state.designerByDesigner?state.designerByDesigner.name:''} />
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
          state={state}
          onChange={onChange}
          type="number"
          label="Length on Deck"
        />
        <Field
          state={state}
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
          state={state}
          onChange={onChange}
          type="number"
        />
        <HandicapField
          name='length_on_waterline'
          label="Length on the waterline"
          state={state}
          onChange={onChange}
          type="number"
          onCancel={onClose}
        />
        <HandicapField
          name='beam'
          label="Beam"
          state={state}
          onChange={onChange}
          type="number"
        />
        <HandicapField
          name='depth'
          label="Depth"
          state={state}
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
          state={state}
          onChange={onChange}
          label="Biggest Staysail"
          fields={['Luff', 'Leach', 'Foot']}
        />
      </Question>
      <Question>
        <Sail
          state={state}
          onChange={onChange}
          label="Biggest Jib"
          fields={['Luff', 'Leach', 'Foot']}
        />
      </Question>
      <Question>
        <Sail
          state={state}
          onChange={onChange}
          label="Biggest Downwind Sail"
          fields={['Luff', 'Leach', 'Foot']}
        />
      </Question>
      <JumpLabel label="afterRacingHeadsails"/>
      <Question>
        <Sail
          state={state}
          onChange={onChange}
          label="Main Sail"
          fields={['Luff', 'Head', 'Foot']}
        />
      </Question>
      <Question>
        <Sail
          state={state}
          onChange={onChange}
          label="Top Sail"
          fields={['Luff', 'Perpendicular']}
        />
      </Question>
      <Question>
        <Sail
          state={state}
          onChange={onChange}
          label="Mizen"
          fields={['Luff', 'Head', 'Foot']}
        />
      </Question>
      <Question>        
        <Sail
          state={state}
          onChange={onChange}
          label="Mizen Topsail"
          fields={['Luff', 'Perpendicular']}
        />
      </Question>
      <Question>
        <Typography>Propellor type</Typography>
        <HandicapField as={<RadioList/>}
          name="propellor"
          state={state}
          onChange={onChange}
          options={['None', 'Fixed', 'Folding', 'Feathering']}
        />
      </Question>
      <Question>
        <Typography>Hull type</Typography>
        <GqlRadioList
          name="hull_form"
          state={state}
          onChange={onChange}
          list="hull_form"
        />
      </Question>
      <JumpLabel label="afterHandicap"/>
      <Question>
        <Typography>Spar material</Typography>
        <GqlRadioList
          name="spar_material"
          state={state}
          onChange={onChange}
          list="spar_material"
        />
      </Question>
      <Question>
        <Typography>Construction method</Typography>
        <GqlRadioList
          name="construction_method"
          list="construction_method"
          state={state}
          onChange={onChange}
        />
      </Question>
      <Question>
        <GqlPicker onChange={onChange} list="construction_material" label="Construction Material" value={state.construction_material||'undefined'} />
      </Question>
      <Question>
        <Typography>Year built / launched</Typography>
        <Field state={state} onChange={onChange} label="Year" />
      </Question>
      <Question>
        <GqlPicker onChange={onChange} id="builder-name" list="builder" label="Builder" value={state.builderByBuilder?state.builderByBuilder.name:''} />
      </Question>
      <Question>
        <ReallyDumbRTE
          label="Short description"
          state={state}
          onSave={onChange}
        />
      </Question>
      <Question>
        <Typography>Location</Typography>        
        <Picker onChange={onChange} options={['UK', 'Ireland', 'France', 'Netherlands', 'Belgium']} label="Home Country" value={state.home_country}/>
        <Field name="home_port" label="Home Port" state={state} onChange={onChange} />
      </Question>
      <Question>
        <Typography>Part 1 British Registry Details</Typography>
        <Field
          name="uk_part1"
          label="Official Registry Number"
          state={state}
          onChange={onChange}
        />
        <Field
          state={state}
          onChange={onChange}
          label="Port of Registry"
        />
        <Field
          state={state}
          onChange={onChange}
          type="number"
          label="Year Registered"
        />
      </Question>
      <Question>
        <Typography>Other Registrations</Typography>
        <Field name="ssr" label="SSR" state={state} onChange={onChange} />
        <Field name="call_sign" label="VHF Call Sign" state={state} onChange={onChange} />
        <Field name="nhsr" label="National Register of Historic Vessels Number" state={state} onChange={onChange} />
        <Field name="nhbr" label="National Small Boats Register Number" state={state} onChange={onChange} />
        <Field name="fishing_number" label="Fishing Number" state={state} onChange={onChange} />
        <Field name="sail_number" label="Sail Number" state={state} onChange={onChange} />
        <Field name="mssi" label="MSSI" state={state} onChange={onChange} />
        <Field name="WIN" label="WIN" state={state} onChange={onChange} />
        <Field name="other_registrations" label="Others" state={state} onChange={onChange} />
      </Question>
      <Question>
      <GqlPicker onChange={onChange} list="generic_type" label="Generic Type" value={state.generic_type}/>
      </Question>
      <Question>
        <ReallyDumbRTE
          label="Full description"
          state={state}
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
          state={state}
          onChange={onChange}
          options={['None', 'Inboard', 'Outboard']}
        />
      </Question>
*/