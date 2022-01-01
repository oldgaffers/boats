import React from "react"
import BrowseBoats from './browseboats';
import { usePicklists } from '../util/picklists';

export default function GqlBoatBrowser({ title, state, ...props }) {
  const { loading, error, data } = usePicklists(state.view || {});

  if (loading) return (<p>Loading...</p>);
  if (error) return (<p>Error :({title})</p>);
  
  return (
      <BrowseBoats 
        title={title}
        pickers={data}
        state={state}
        {...props}
      />
  );
};
