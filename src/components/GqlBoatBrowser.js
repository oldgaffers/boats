import React, { useState } from "react"
import BrowseBoats from './browseboats';
import { usePicklists } from '../util/picklists';

export default function GqlBoatBrowser(
  {
    title, 
    defaultState,
    onPageSizeChange = (bpp) => console.log(`${title} page size change`, bpp),
    onSortChange = (field, dir) => console.log(`${title} sortchange`, field, dir),
    onFilterChange = (filters) => console.log(`${title} filter change`, filters),
    onPageChange = (page) => console.log(`${title} page change`, page),
    link,
    location,
  }
) {
  const { loading, error, data } = usePicklists();
  const [state, setState] = useState(defaultState);

  if (loading) return (<p>Loading...</p>);
  if (error) return (<p>Error :({title})</p>);

  const handlePageSizeChange = (bpp) => {
    onPageSizeChange(bpp);
    setState({...state, boatsPerPage: bpp });
  };

  const handleSortChange = (field, dir) => {
    onSortChange(field, dir);
    setState({...state, sortField: field, sortDirection: dir });
  }

  const handleFilterChange = (filters) => {
    onFilterChange(filters);
    setState({...state, filters });
  }

  const handlePageChange = (page) => {
    onPageChange(page);
    setState({...state, page });
  };

  return (
      <BrowseBoats 
        pickers={data} state={state}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        link={link}
        location={location}
      />
  );
};
