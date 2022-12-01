import React from "react"
import BrowseBoats from './browseboats';
import { CircularProgress } from "@mui/material";
import { useGetPicklists } from "./boatregisterposts";

export default function StaticPickerBoatBrowser({ title, state, ...props }) {
  const { data, error, loading } = useGetPicklists();
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
