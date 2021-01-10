import React, { useState } from "react"
import BrowseBoats from './browseboats';
import { usePicklists } from '../util/picklists';

export default function GqlBoatBrowser({ title, defaultState }) {
  const { loading, error, data } = usePicklists();
  const [state, setState] = useState(defaultState);

  if (loading) return (<p>Loading...</p>);
  if (error) return (<p>Error :({title})</p>);

  const handlePageSizeChange = (bpp) => {
    console.log(`${title} page size change`, bpp);
    setState({...state, boatsPerPage: bpp });
  };

  const handleSortChange = (field, dir) => {
    console.log(`${title} sortchange`, field, dir);
    setState({...state, sortField: field, sortDirection: dir });
  }

  const handleFilterChange = (filters) => {
    console.log(`${title} filter change`, filters);
    setState({...state, filters });
  }

  const handlePageChange = (page) => {
    console.log(`${title} page change`, page);
    setState({...state, page });
  };

  return (
      <BrowseBoats 
        pickers={data} state={state}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
      />
  );
};
