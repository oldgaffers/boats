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

  const [state, setState] = useState(
    {
      ...boat, contact_email: email, 
      short_description: htmlToRTE(boat.short_description),
      full_description: htmlToRTE(boat.full_description),
      design:'one_off',
      mine: false,
      images: [],      
      engine: 'inboard',
      }
  );

  async function handleSubmit(event) {
    const data = {...state};
    data.short_description = stateToHTML(convertFromRaw(JSON.parse(state.short_description)));
    data.full_description = stateToHTML(convertFromRaw(JSON.parse(state.full_description)));
    console.log(data);
    await axios.post(
      'https://ae69efba7038dcdfe87ce1c3479d2976.m.pipedream.net',
      data,
      );
    onClose(event);
  }

  function handleChange(newstate) {
    setState({...newstate});
  }

  return (
      <form>
        <BoatForm
          state={state} 
          onChange={handleChange} 
          onSubmit={handleSubmit} 
          onClose={onClose}
        />
      </form>
  );
}
