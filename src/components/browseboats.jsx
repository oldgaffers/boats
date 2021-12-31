import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import SearchAndFilterBoats from './searchandfilterboats';
import BoatCards from './boatcards';
import TabularView from './tabularview';

export function makeBoatNameList(boat) {
  if (!boat) {
    return [];
  }
  const currentBoatNames = boat.map((b) => (b.name));
  const previousBoatNames = boat.map((b) => b.previous_names).flat();
  const setOfBoats = new Set([...currentBoatNames, ...previousBoatNames]);
  const allBoatNames = [...setOfBoats].filter((name) => name);
  allBoatNames.sort((a, b) => (a.toLowerCase().localeCompare(b.toLowerCase())));
  if (allBoatNames[0] === '') allBoatNames.shift();
  return allBoatNames.map((n) => ({ name: n, __typename: 'boat' }));
}

export default function BrowseBoats({
  pickers,
  state,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onFilterChange,
}) {
  const { bpp, sort, sortDirection, filters } = state;
  const [ marked, setMarked] = useState(filters.oga_nos || []);
  const [ isMarkedOnly, setIsMarkedOnly] = useState(!!filters.oga_nos);
  const blank = "_blank";

  const updateMarkedFilter = (on, marks) => {
    if (on && marks.length > 0) {
      onFilterChange({...filters, oga_nos: marks });
    } else {
      const f = { ...filters };
      delete f.oga_nos;
      onFilterChange(f);
    }
  }

  const handleMarkChange = (isMarked, boat) => {
    if (isMarked) {
      if (marked.includes(boat)) {
        console.log('already in', boat);
      } else {
        const nm = [...marked, boat];
        setMarked(nm);
        updateMarkedFilter(isMarkedOnly, nm);
      }
    } else if (marked.includes(boat)) {
      const nm = marked.filter((value) => value !== boat);
      setMarked(nm);
      updateMarkedFilter(isMarkedOnly, nm);
      if (nm.length === 0) {
        setIsMarkedOnly(false);
      }
    }
  };

  const handleMarkedOnly = (isMarkedOnly) => {
    updateMarkedFilter(isMarkedOnly, marked);
    if (isMarkedOnly && marked.length>0) {
      setIsMarkedOnly(true);
    } else {
      setIsMarkedOnly(false);
    }
  }

  return (
    <div>
      <Paper> 
        {isMarkedOnly?<TabularView state={state} marked={marked} />:''}
        <SearchAndFilterBoats
          sortField={sort}
          sortDirection={sortDirection}
          boatsPerPage={bpp}
          filters={filters}
          view={state.view}
          onPageSizeChange={onPageSizeChange}
          onSortChange={onSortChange}
          onFilterChange={onFilterChange}
          onMarkedOnly={handleMarkedOnly}
          pickers={{ boatNames: makeBoatNameList(pickers.boat), ...pickers }}
          haveMarks={marked.length>0}
          isMarkedOnly={isMarkedOnly}
        />
        <Divider />
        <BoatCards
          state={state} marked={marked}
          onChangePage={onPageChange}
          onMarkChange = {handleMarkChange}
        />
        <Divider />
        <Typography>
          Other great places to look for boats are:
        </Typography>
        <List>
          <ListItem>
            <Typography>
              <a target={blank} href="https://www.nationalhistoricships.org.uk">
                National Historic Ships
              </a>
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              <a target={blank} href="https://nmmc.co.uk/explore/databases/">NMM Cornwall</a>&nbsp;
              maintain a number of interesting databases including small boats and
              yacht designs
            </Typography>
          </ListItem>
        </List>
        <Typography variant='body2'>OGA Boat Register %%VERSION%%</Typography>
      </Paper>
    </div>
  );
}

BrowseBoats.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};
