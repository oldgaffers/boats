import React, { useState } from "react"
import BrowseBoats from './browseboats';
import { usePicklists } from '../util/picklists';
import {mapState} from '../util/gr';

export default function GqlBoatBrowser(
  {
    title, 
    onPageSizeChange = (bpp) => console.log(`${title} page size change`, bpp),
    onSortChange = (field, dir) => console.log(`${title} sortchange`, field, dir),
    onFilterChange = (filters) => console.log(`${title} filter change`, filters),
    onPageChange = (page) => console.log(`${title} page change`, page),
    link,
    location,
    state,
  }
) {
  const [currentState, setCurrentState] = useState(mapState(state));
  const { loading, error, data } = usePicklists(currentState.view);

  if (loading) return (<p>Loading...</p>);
  if (error) return (<p>Error :({title})</p>);

  const handlePageSizeChange = (bpp) => {
    onPageSizeChange(bpp);
    setCurrentState({...currentState, bpp: bpp });
  };

  const handleSortChange = (field, dir) => {
    onSortChange(field, dir);
    setCurrentState({...currentState, sort: field, sortDirection: dir });
  }

  const handleFilterChange = (filters) => {
    onFilterChange(filters);
    setCurrentState({...currentState, filters, page: 1 });
  }

  const handlePageChange = (page) => {
    onPageChange(page);
    setCurrentState({...currentState, page });
  };

  return (
      <BrowseBoats 
        pickers={data} state={currentState}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        link={link}
        location={location}
      />
  );
};
