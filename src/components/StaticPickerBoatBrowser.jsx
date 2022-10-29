import React from "react"
import BrowseBoats from './browseboats';
import { useAxios } from 'use-axios-client';
import { CircularProgress } from "@mui/material";

export default function StaticPickerBoatBrowser({ title, state, ...props }) {
  const { data, error, loading } = useAxios({
    url: 'https://oldgaffers.github.io/boatregister/pickers.json'
  });
  if (error) {
        return (<div>
          Sorry, we had a problem getting the data to browse the register
          </div>);
  }
  if (loading || !data) return <CircularProgress/>

  return (
      <BrowseBoats 
        title={title}
        pickers={data}
        state={state}
        {...props}
      />
  );
};
