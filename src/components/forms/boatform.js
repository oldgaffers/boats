import React, { useState, isValidElement, cloneElement } from 'react';
import { Button, Container, Typography, TextField } from '@material-ui/core';
import MUIRichTextEditor from 'mui-rte';
import RadioList from './radiolist';
import ComboBox from './combobox';

function Step({
  step,
  currentStep,
  onNext,
  onPrev,
  children,
  disabled,
  onSubmit,
}) {
  if (currentStep !== step) {
    return null;
  }
  return (
    <>
      {children}
      <Container>
        {onPrev ? (
          <Button variant="contained" onClick={onPrev}>
            Back
          </Button>
        ) : (
          ''
        )}
        {onNext ? (
          <Button variant="contained" onClick={onNext}>
            Next
          </Button>
        ) : (
          <Button variant="contained" onClick={onSubmit}>
            Submit
          </Button>
        )}
      </Container>
    </>
  );
}

function JumpStep({
  children,
  step,
  currentStep,
  onNext,
  onPrev,
  onJump,
  nextLabel,
  jumpLabel,
}) {
  if (currentStep !== step) {
    return null;
  }
  return (
    <>
      {children}
      <Container>
        <Button variant="contained" onClick={onPrev}>
          Back
        </Button>
        <Button variant="contained" onClick={onNext}>
          {nextLabel}
        </Button>
        <Button variant="contained" onClick={onJump}>
          {jumpLabel}
        </Button>
      </Container>
    </>
  );
}

function ReallyDumbRTE({
  label,
  state,
  onChange = (editorState) => {},
  onSave = (editorState) => {},
}) {
  let name = label.replace(/ /g, '_').toLowerCase();

  function handleSave(data) {
    // console.log(data);
    const newstate = { ...state };
    newstate[name] = data;
    onSave(newstate);
  }

  return (
    <>
      <Typography>{label}</Typography>
      <MUIRichTextEditor
        label="Start typing..."
        name={name}
        onChange={onChange}
        onSave={handleSave}
        value={state[name]}
      />
    </>
  );
}

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

export default function BoatForm({ state, onChange, onSubmit }) {
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

  return (
    <>
      <Step step={n++} currentStep={step} onNext={handleNext}>
        <Field name="name" label="Current name of boat" state={state} onChange={onChange} />
        <Field
          state={state}
          onChange={onChange}
          label="Contact email"
        />
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <Typography>Upload some Pictures</Typography>
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <Field
          state={state}
          onChange={onChange}
          label="Previous names"
        />
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
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
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <ComboBox
          name="design_class"
          label="Class name"
          options={['Heard 23', 'Heard 28']}
          state={state}
          onChange={onChange}
        />
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <Typography>Main sail type</Typography>
        <RadioList
          name="mainsail_type"
          state={state}
          onChange={onChange}
          options={[
            'Bermudan',
            'Gaff',
            'Gunter',
            'Junk',
            'Lateen',
            'Lug',
            'Spritsail',
            'Square',
          ]}
        />
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <Typography>Rig type</Typography>
        <RadioList
          name="rig_type"
          state={state}
          onChange={onChange}
          options={['Cutter', 'Ketch', 'Yawl', 'Schooner', 'Sloop', 'Cat boat']}
        />
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <Typography>Engine</Typography>
        <RadioList
          name="engine"
          state={state}
          onChange={onChange}
          options={['None', 'Inboard', 'Outboard']}
        />
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <ComboBox
          label="Designer"
          options={['Martin Heard', 'Denys Rayner']}
          state={state}
          onChange={onChange}
        />
      </Step>
      <JumpStep
        step={(firstBeforeHandicap = n++)}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
        onJump={jumpPastHandicap}
        nextLabel="Enter Handicapping Details"
        jumpLabel="Not Now"
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
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <Typography>Measurement Diagram</Typography>
        <img alt="measurement diagram" src="hull-measurements.png" />
      </Step>

      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
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
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      ></Step>
      <JumpStep
        step={(firstBeforeRacingHeadsails = n++)}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
        onJump={jumpPastRacingHeadsails}
        nextLabel="Enter Headsail Details"
        jumpLabel="No headsails set when racing"
      >
        <Field state={state} onChange={onChange} label="Sail Area" />
        <Sail
          state={state}
          onChange={onChange}
          label="Fore triangle"
          fields={['Height', 'Base']}
        />
      </JumpStep>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <Sail
          state={state}
          onChange={onChange}
          label="Biggest Staysail"
          fields={['Luff', 'Leach', 'Foot']}
        />
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <Sail
          state={state}
          onChange={onChange}
          label="Biggest Jib"
          fields={['Luff', 'Leach', 'Foot']}
        />
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <Sail
          state={state}
          onChange={onChange}
          label="Biggest Downwind Sail"
          fields={['Luff', 'Leach', 'Foot']}
        />
      </Step>
      <Step
        step={(firstPastRacingHeadsails = n++)}
        currentStep={step}
        onPrev={jumpBackPastRacingHeadsails}
        onNext={handleNext}
      >
        <Sail
          state={state}
          onChange={onChange}
          label="Main Sail"
          fields={['Luff', 'Head', 'Foot']}
        />
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <Sail
          state={state}
          onChange={onChange}
          label="Top Sail"
          fields={['Luff', 'Perpendicular']}
        />
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <Sail
          state={state}
          onChange={onChange}
          label="Mizen"
          fields={['Luff', 'Head', 'Foot']}
        />
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <Sail
          state={state}
          onChange={onChange}
          label="Mizen Topsail"
          fields={['Luff', 'Perpendicular']}
        />
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <Typography>Propellor type</Typography>
        <HandicapField as={<RadioList/>}
          name="propellor"
          state={state}
          onChange={onChange}
          options={['None', 'Fixed', 'Folding', 'Feathering']}
        />
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
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
      </Step>
      <Step
        step={(firstPastHandicap = n++)}
        currentStep={step}
        onPrev={jumpBackPastHandicap}
        onNext={handleNext}
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
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
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
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <Typography>Construction material</Typography>
        <RadioList
          name="construction_material"
          state={state}
          onChange={onChange}
          options={[
            'GRP',
            'Wood',
            'Plywood',
            'Steel',
            'Aluminium',
            'Ferro',
            'Iron',
            'wood/epoxy',
            'other',
          ]}
        />
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <Typography>Year built / launched</Typography>
        <Field state={state} onChange={onChange} label="Year" />
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <ComboBox
          label="Builder"
          options={['Gaffers and Luggers', 'Cornish Crabbers', 'Home Build']}
          state={state}
          onChange={onChange}
        />
      </Step>
      <Step
        step={(f.sd = n++)}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <ReallyDumbRTE
          label="Short description"
          state={state}
          onSave={onChange}
        />
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <Typography>Location</Typography>
        <ComboBox name="home_country" 
          label="Home Country"
          options={['UK', 'Ireland', 'France', 'Netherlands', 'Belgium']}
          state={state}
          onChange={onChange}
        />
        <Field name="home_port" label="Home Port" state={state} onChange={onChange} />
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
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
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <Typography>Other Registrations</Typography>
        <Field name="ssr" label="SSR" state={state} onChange={onChange} />
        <Field name="call_sign" label="VHF Call Sign" state={state} onChange={onChange} />
        <Field name="nhsr" label="National Register of Historic Vessels Number" state={state} onChange={onChange} />
        <Field name="nhbr" label="National Small Boats Register Number" state={state} onChange={onChange} />
        <Field name="fishing_number" label="Fishing Number" state={state} onChange={onChange} />
        <Field name="sail_number" label="Sail Number" state={state} onChange={onChange} />
        <Field name="mssi" label="MSSI" state={state} onChange={onChange} />
        <Field name="other_registrations" label="Others" state={state} onChange={onChange} />
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
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
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
      >
        <ComboBox
          name="generic_type"
          label="Generic type"
          options={['Yacht', 'Dinghy']}
          state={state}
          onChange={onChange}
        />
      </Step>
      <Step
        step={n}
        currentStep={step}
        onPrev={handlePrev}
        disabled={false /* TODO */}
        onSubmit={onSubmit}
      >
        <ReallyDumbRTE
          label="Full description"
          state={state}
          onSave={onChange}
        />
      </Step>
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
