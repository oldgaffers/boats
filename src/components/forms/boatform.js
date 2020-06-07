import React, { useState, isValidElement, cloneElement } from 'react';
import { Button, Typography, TextField } from '@material-ui/core';
import MUIRichTextEditor from 'mui-rte';
import RadioList from './radiolist';
import ComboBox from './combobox';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

function Step({
  step,
  currentStep,
  onNext,
  onPrev,
  children,
  disabled,
  onSubmit,
  onCancel
}) {
  if (currentStep !== step) {
    return null;
  }
  return (
    <>
    <DialogContent>
    {children}
    </DialogContent>
    <DialogActions>
        <Button onClick={onCancel} color="primary">
            Cancel
        </Button>
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
      </DialogActions>
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
  onCancel,
  nextLabel,
  jumpLabel,
}) {
  if (currentStep !== step) {
    return null;
  }
  return (
    <>
    <DialogContent>
    {children}
    </DialogContent>
    <DialogActions>
        <Button onClick={onCancel} color="primary">
            Cancel
        </Button>
        <Button variant="contained" onClick={onPrev}>
          Back
        </Button>
        <Button variant="contained" onClick={onNext}>
          {nextLabel}
        </Button>
        <Button variant="contained" onClick={onJump}>
          {jumpLabel}
        </Button>
      </DialogActions>
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

export default function BoatForm({ 
  boat, email, state, onChange, onSubmit, onClose }) {
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
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
        onCancel={onClose}
      >
        <Typography>Upload some Pictures</Typography>
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
        onCancel={onClose}
      >
        <Typography>Measurement Diagram</Typography>
        <img alt="measurement diagram" src="hull-measurements.png" />
      </Step>

      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
        onCancel={onClose}
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
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
        onCancel={onClose}
      ></Step>
      <JumpStep
        step={(firstBeforeRacingHeadsails = n++)}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
        onJump={jumpPastRacingHeadsails}
        nextLabel="Enter Headsail Details"
        jumpLabel="No headsails set when racing"
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
      >
        <Typography>Year built / launched</Typography>
        <Field state={state} onChange={onChange} label="Year" />
      </Step>
      <Step
        step={n++}
        currentStep={step}
        onPrev={handlePrev}
        onNext={handleNext}
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
        onCancel={onClose}
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
