import React, { useState } from 'react';
import axios from 'axios';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromHTML, ContentState, convertToRaw, convertFromRaw } from 'draft-js'
import BoatForm from './boatform';

function htmlToRTE(html) {
  const contentHTML = convertFromHTML(html);
  const contentState = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap)
  return JSON.stringify(convertToRaw(contentState));
}

export default function EditBoat({ boat, email, onClose }) {

  const [state, setState] = useState({
    contact_email: '',
    design:'one_off',
    mine: false,
    images: [],
    
    engine: 'inboard',

    name: '',
    previous_names: undefined,
    design_class: '',
    designer: undefined,
    mainsail_type: 'gaff',
    rig_type: 'cutter',
    length_on_deck: undefined,
    draft: undefined,
    handicap_data: {},
    hull_form: 'long keel deep forefoot',
    spar_material: 'wood',
    construction_method: 'carvel',
    construction_material: 'wood',
    year: undefined,
    builder: undefined,
    short_description: htmlToRTE('<p>some text</p>'),
    home_country: undefined,
    home_port: undefined,
    uk_part1: undefined,
    port_of_registry: undefined,
    year_registered: undefined,
    ssr: undefined,
    call_sign: undefined,
    nhsr: undefined,
    nsbr: undefined,
    fishing_number: undefined,
    sail_number: undefined,
    mssi: undefined,
    other_registrations: undefined,
    currentFunction: undefined,
    originalFunction: undefined,
    generic_type: undefined,
    full_description: htmlToRTE(''),
  });

  async function handleSubmit(event) {
    const data = {...state};
    data.short_description = stateToHTML(convertFromRaw(JSON.parse(state.short_description)));
    data.full_description = stateToHTML(convertFromRaw(JSON.parse(state.full_description)));
    console.log(data);
    await axios.post(
      'https://ae69efba7038dcdfe87ce1c3479d2976.m.pipedream.net',
      data,
      );
  }

  function handleChange(newstate) {
    setState({...newstate});
  }

  return (
      <form>
        <BoatForm 
        state={state} onChange={handleChange} onSubmit={handleSubmit}
        boat={boat} email={email} onClose={onClose}
        />
      </form>
  );
}
