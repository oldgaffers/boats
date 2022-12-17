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
import { getFilterable } from './boatregisterposts';
import BoatRegisterIntro from "./boatregisterintro";
import BoatsForSaleIntro from "./boatsforsaleintro";
import SmallBoatsIntro from "./smallboatsintro";

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

function Intro({view}) {
  switch (view) {
    case 'sell': return <BoatsForSaleIntro />;
    case 'small': return <SmallBoatsIntro />;
    default: return <BoatRegisterIntro />;
  }
}

export default function BrowseBoats({
  state,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onFilterChange,
  onMarkedOnlyChange,
  isMarkedOnly,
  onBoatMarked,
  onBoatUnMarked,
}) {
  // const { data, error, loading } = useGetFilterable();
  const { bpp, sort, sortDirection, filters } = state;
  console.log('xxx');

  const [data, setData] = useState();

  useEffect(() => {
    if (!data) {
      getFilterable().then((r) => setData(r.data) ).catch((e) => console.log(e));
    }
  }, [data]);
  /*
  if (loading || !data) return <CircularProgress />
  if (error) {
    console.log(error);
  }
  */
  if (!data) return <CircularProgress />;

  const blank = "_blank";

  const filtered = applyFilters(data, filters);
  const pickers = makePickers(filtered);

  console.log('xyy', filtered);
  return (
      <Paper>
        <Intro view={state.view}/>
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
          onMarkedOnlyChange={onMarkedOnlyChange}
          isMarkedOnly={isMarkedOnly}
        />
        <Divider />
        <BoatCards
          state={state}
          onChangePage={onPageChange}
          onBoatMarked={onBoatMarked}
          onBoatUnMarked={onBoatUnMarked}
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
  );
}

BrowseBoats.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};
