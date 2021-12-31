import React from "react"
import BrowseBoats from './browseboats';
import { usePicklists } from '../util/picklists';
import { mapState } from '../util/rr';

export default function GqlBoatBrowser(
  {
    title, 
    onPageSizeChange = (bpp) => console.log(`${title} page size change`, bpp),
    onSortChange = (field, dir) => console.log(`${title} sortchange`, field, dir),
    onFilterChange = (filters) => console.log(`${title} filter change`, filters),
    onPageChange = (page) => console.log(`${title} page change`, page),
    state,
  }
) {
  const currentState = mapState(state);
  const { loading, error, data } = usePicklists(currentState.view);

  if (loading) return (<p>Loading...</p>);
  if (error) return (<p>Error :({title})</p>);
  
  return (
      <BrowseBoats 
        pickers={data} state={currentState}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onSortChange={onSortChange}
        onFilterChange={onFilterChange}
      />
  );
};
