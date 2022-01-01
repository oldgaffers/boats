import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import SearchAndFilterBoats from './searchandfilterboats';
import BoatCards from './boatcards';
// import TabularView from './tabularview';

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
  markList,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onFilterChange,
  onMarkedOnlyChange,
  isMarkedOnly,
  onBoatMarked,
  onBoatUnMarked,
}) {
  const { bpp, sort, sortDirection, filters } = state;
  const blank = "_blank";

  const handleMarkedOnly = (value) => {
    onMarkedOnlyChange(value);
  }

  // {markedOnly?<TabularView state={state} marked={markedBoats} />:''}

  return (
    <div>
      <Paper> 
        <SearchAndFilterBoats
          sortField={sort}
          sortDirection={sortDirection}
          boatsPerPage={bpp}
          filters={filters}
          view={state.view}
          pickers={{ boatNames: makeBoatNameList(pickers.boat), ...pickers }}
          onPageSizeChange={onPageSizeChange}
          onSortChange={onSortChange}
          onFilterChange={onFilterChange}
          onMarkedOnly={(value) => handleMarkedOnly(value)}
          isMarkedOnly={isMarkedOnly}
        />
        <Divider />
        <BoatCards
          state={state} markList={markList} onChangePage={onPageChange}
          onBoatMarked={onBoatMarked} onBoatUnMarked={onBoatUnMarked}
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
