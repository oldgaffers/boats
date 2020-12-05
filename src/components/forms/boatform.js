import React, { useState, isValidElement, cloneElement } from 'react';
import { Typography, TextField } from '@material-ui/core';
import RadioList from './radiolist';
import ComboBox from './combobox';
import { Step, JumpStep } from '../../util/formsteps';
import ReallyDumbRTE from '../../util/ReallyDumbRTE';
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

  let f = {};
  let firstPastHandicap = 0;
  let firstPastRacingHeadsails = 0;
  let firstBeforeHandicap = 0;
  let firstBeforeRacingHeadsails = 0;

  function handleNext() {
    setStep(step + 1);
  }

  function handlePrev() {
    setStep(step - 1);
  }

  let n = 1;

  function Next({ children, pos }) {
    return (
      <Step
        step={pos}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
        onCancel={onClose}
    >{children}</Step>
    );

  }

  return (
    <>
      <Next pos={n++}>
        <Field
          state={state}
          onChange={onChange}
          label="Previous names"
          value={state.previous_names?state.previous_names.join(', '):''}
        />
      </Next>
      <Next pos={n++}>
        <Typography>Design Class</Typography>
        <RadioList
          name="design"
          state={state}
          onChange={onChange}
          options={[
            'One off',
            'Standard example of a production class',
            'Modified example of a production class',
          ]}
        />
      </Next>
      <Next pos={n++}>
        <Picker onChange={onChange} options="design_class" label="Design Class" value={state.designClassByDesignClass.name}/>
      </Next>
      <Next pos={n++}>
        <Picker onChange={onChange} options="sail_type" label="Mainsail Type" value={state.mainsail_type}/>
      </Next>
      <Next pos={n++}>
        <Picker onChange={onChange} options="rig_type" label="Rig Type" value={state.rigTypeByRigType.name}/>
      </Next>
      <Next pos={n++}>
        <Typography>Engine</Typography>
        <RadioList
          name="engine"
          state={state}
          onChange={onChange}
          options={['None', 'Inboard', 'Outboard']}
        />
      </Next>
      <Next pos={n++}>
        <Picker onChange={onChange} options="designer" label="Designer" value={state.designerByDesigner.name} />
      </Next>
      <JumpStep
        step={(firstBeforeHandicap = n++)}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
        onJump={jumpPastHandicap}
        nextLabel="Enter Handicapping Details"
        jumpLabel="Not Now"
        onCancel={onClose}
      >
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
      </JumpStep>
      <Next pos={n++}>
        <Typography>Measurement Diagram</Typography>
        <img alt="measurement diagram" src="hull-measurements.png" />
      </Next>
      <Next pos={n++}>
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
      </Next>
      <Next pos={n++}>
        <Sail
          state={state}
          onChange={onChange}
          label="Biggest Staysail"
          fields={['Luff', 'Leach', 'Foot']}
        />
      </Next>
      <Next pos={n++}>
        <Sail
          state={state}
          onChange={onChange}
          label="Biggest Jib"
          fields={['Luff', 'Leach', 'Foot']}
        />
      </Next>
      <Next pos={n++}>
        <Sail
          state={state}
          onChange={onChange}
          label="Biggest Downwind Sail"
          fields={['Luff', 'Leach', 'Foot']}
        />
      </Next>
      <Step
        step={(firstPastRacingHeadsails = n++)}
        currentStep={step}
        onPrev={jumpBackPastRacingHeadsails}
        onNext={handleNext}
        onCancel={onClose}
      >
        <Sail
          state={state}
          onChange={onChange}
          label="Main Sail"
          fields={['Luff', 'Head', 'Foot']}
        />
      </Step>
      <Next pos={n++}>
        <Sail
          state={state}
          onChange={onChange}
          label="Top Sail"
          fields={['Luff', 'Perpendicular']}
        />
      </Next>
      <Next pos={n++}>
        <Sail
          state={state}
          onChange={onChange}
          label="Mizen"
          fields={['Luff', 'Head', 'Foot']}
        />
      </Next>
      <Next pos={n++}>        
        <Sail
          state={state}
          onChange={onChange}
          label="Mizen Topsail"
          fields={['Luff', 'Perpendicular']}
        />
      </Next>
      <Next pos={n++}>
        <Typography>Propellor type</Typography>
        <HandicapField as={<RadioList/>}
          name="propellor"
          state={state}
          onChange={onChange}
          options={['None', 'Fixed', 'Folding', 'Feathering']}
        />
      </Next>
      <Next pos={n++}>
        <Typography>Hull type</Typography>
        <RadioList
          name="hull_form"
          state={state}
          onChange={onChange}
          options={[
            'long keel deep forefoot',
            'long keel sloping forefoot',
            'cut away stern',
            'fin keel',
            'bilge keel',
            'centre-boarder',
            'dinghy',
            'centre-board dinghy',
          ]}
        />
      </Next>
      <Next
        step={(firstPastHandicap = n++)}
        onPrev={jumpBackPastHandicap}
      >
        <Typography>Spar material</Typography>
        <RadioList
          name="spar_material"
          state={state}
          onChange={onChange}
          options={[
            'Wood',
            'Alloy',
            'Steel',
            'Carbon',
            'Wood/Carbon',
            'Alloy/Carbon',
          ]}
        />
      </Next>
      <Next pos={n++}>
        <Typography>Construction method</Typography>
        <RadioList
          name="construction_method"
          state={state}
          onChange={onChange}
          options={[
            'Carvel',
            'Clinker',
            'Cold moulded',
            'Hot Moulded',
            'Clinker-ply',
            'Stitch and glue',
            'Strip planking',
            'Strip planking / epoxy sheathed',
          ]}
        />
      </Next>
      <Next pos={n++}>
        <Picker onChange={onChange} options="construction_material" label="Construction Material" value={state.construction_material} />
      </Next>
      <Next pos={n++}>
        <Typography>Year built / launched</Typography>
        <Field state={state} onChange={onChange} label="Year" />
      </Next>
      <Next pos={n++}>
        <Picker onChange={onChange} id="builder-name" options="builder" label="Builder" value={state.builderByBuilder.name} />
      </Next>
      <Next pos={n++}>
        <ReallyDumbRTE
          label="Short description"
          state={state}
          onSave={onChange}
        />
      </Next>
      <Next pos={n++}>
        <Typography>Location</Typography>
        <ComboBox name="home_country" 
          label="Home Country"
          options={['UK', 'Ireland', 'France', 'Netherlands', 'Belgium']}
          state={state}
          onChange={onChange}
        />
        <Field name="home_port" label="Home Port" state={state} onChange={onChange} />
      </Next>
      <Next pos={n++}>
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
      </Next>
      <Next pos={n++}>
        <Typography>Other Registrations</Typography>
        <Field name="ssr" label="SSR" state={state} onChange={onChange} />
        <Field name="call_sign" label="VHF Call Sign" state={state} onChange={onChange} />
        <Field name="nhsr" label="National Register of Historic Vessels Number" state={state} onChange={onChange} />
        <Field name="nhbr" label="National Small Boats Register Number" state={state} onChange={onChange} />
        <Field name="fishing_number" label="Fishing Number" state={state} onChange={onChange} />
        <Field name="sail_number" label="Sail Number" state={state} onChange={onChange} />
        <Field name="mssi" label="MSSI" state={state} onChange={onChange} />
        <Field name="other_registrations" label="Others" state={state} onChange={onChange} />
      </Next>
      <Next pos={n++}>
        <Typography>Function</Typography>
        <ComboBox
          label="Current Function"
          options={['Leisure', 'Fishing']}
          state={state}
          onChange={onChange}
        />
        <ComboBox
          label="Original Function"
          options={['Leisure', 'Fishing']}
          state={state}
          onChange={onChange}
        />
      </Next>
      <Next pos={n++}>
      <Picker onChange={onChange} options="generic_type" label="Generic Type" value={state.generic_type}/>
      </Next>
      <Next
        step={n}
        onSubmit={onSubmit}
        onCancel={onClose}
      >
        <ReallyDumbRTE
          label="Full description"
          state={state}
          onSave={onChange}
        />
      </Next>
    </>
  );

  function jumpPastHandicap() {
    setStep(firstPastHandicap);
  }

  function jumpPastRacingHeadsails() {
    setStep(firstPastRacingHeadsails);
  }

  function jumpBackPastHandicap() {
    setStep(firstBeforeHandicap);
  }

  function jumpBackPastRacingHeadsails() {
    setStep(firstBeforeRacingHeadsails);
  }
}
