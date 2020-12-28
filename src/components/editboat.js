import React, { useState } from 'react';
import axios from 'axios';
import BoatForm from './boatform';

export default function EditBoat({ boat, pickers, email, onClose }) {

  const [state, setState] = useState(
    {
      ...boat, contact_email: email, 
      design:'one_off',
      mine: false,
      images: [],      
      engine: 'inboard',
      }
  );

  async function handleSubmit(event) {
    const data = {...state};
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
          pickers={pickers}
          onChange={handleChange} 
          onSubmit={handleSubmit} 
          onClose={onClose}
        />
      </form>
  );
}
