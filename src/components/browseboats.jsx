import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import SearchAndFilterBoats from './searchandfilterboats';
import BoatCards from './boatcards';
import { applyFilters } from '../util/oganoutils';
import { useGetFilterable } from './boatregisterposts';

function makePickers(filtered) {
  const pickers = {};
  [
    "name",
    "designer",
    "builder",
    "rig_type",
    "mainsail_type",
    "generic_type",
    "design_class",
    "construction_material",
  ].forEach((key) => {
    pickers[key] = [...new Set(filtered.map((boat) => {
      return boat[key];
    }).filter((v) => v))]
  });
  const years = filtered.map((boat) => boat.year).filter((y) => y);
  years.sort();
  pickers.year = {
    step: 10,
    min: years[0] || 1800,
    max: years[years.length - 1] || new Date().getFullYear(),
  };
  return pickers;
}

export default function BrowseBoats({
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
  const { data, error, loading } = useGetFilterable();
  const [pickers, setPickers] = useState();
  const { bpp, sort, sortDirection, filters } = state;

  console.log('BrowseBoats', markList);

  useEffect(() => {
    if (data) {
      const filtered = applyFilters(data, filters);
      const newPickers = makePickers(filtered);
      if (pickers) {
        let changes = false;
        if (changes) {
          setPickers(newPickers);
        }
      } else {
        setPickers(newPickers);
      }
    }
  }, [pickers, data, filters]);

  if (loading || !pickers) return <CircularProgress />
  if (error) {
    console.log(error);
  }
  const blank = "_blank";

  const handleMarkedOnly = (value) => {
    onMarkedOnlyChange(value);
  }

  return (
    <div>
      <Paper>
        <SearchAndFilterBoats
          sortField={sort}
          sortDirection={sortDirection}
          boatsPerPage={bpp}
          filters={filters}
          view={state.view}
          pickers={pickers}
          onPageSizeChange={onPageSizeChange}
          onSortChange={onSortChange}
          onFilterChange={onFilterChange}
          onMarkedOnly={(value) => handleMarkedOnly(value)}
          isMarkedOnly={isMarkedOnly} markList={markList}
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
