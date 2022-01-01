import React from "react"
import BrowseBoats from './browseboats';
import { usePicklists } from '../util/picklists';
import { mapState } from '../util/rr';

export default function GqlBoatBrowser({ title, state, ...props }) {
  const currentState = mapState(state);
  const { loading, error, data } = usePicklists(currentState.view);

  if (loading) return (<p>Loading...</p>);
  if (error) return (<p>Error :({title})</p>);
  
  return (
      <BrowseBoats 
        title={title}
        pickers={data}
        state={currentState}
        {...props}
      />
  );
};
