import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import SearchAndFilterBoats from './searchandfilterboats';
import BoatCards from './boatcards';
import { useFilterable, applyFilters } from '../util/oganoutils';
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
  const { data, error, loading } = useFilterable();
  const pickers = {
    name: [],
    designer: [],
    builder: [],
    rig_type: [],
    mainsail_type: [],
    generic_type: [],
    design_class: [],
    construction_material: [],
  };

  const { bpp, sort, sortDirection, filters } = state;

  useEffect(() => {
    if (data) {
      // console.log('filterable', data);
      // console.log('filters', filters);
      const filtered = applyFilters(data, filters);
      console.log('filtered', filtered);
      Object.keys(pickers).forEach((key) => {
        pickers[key] = [...new Set(filtered.map((boat) => {
          // console.log(boat);
          return boat[key];
        }).filter((v) => v))];
      });
      console.log('pickers', pickers);
    }
  });

  if (loading) return <CircularProgress/>
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
