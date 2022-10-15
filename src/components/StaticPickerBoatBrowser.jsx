import React from "react"
import BrowseBoats from './browseboats';
import useAxios from 'axios-hooks';

export default function StaticPickerBoatBrowser({ title, state, ...props }) {
  const [b] = useAxios('https://ogauk.github.io/boatregister/pickers.json')
  if (b.loading) return <p>Loading...</p>
  if (b.error) {
        return (<div>
          Sorry, we had a problem getting the data to browse the register
          </div>);
  }

  return (
      <BrowseBoats 
        title={title}
        pickers={b.data}
        state={state}
        {...props}
      />
  );
};
