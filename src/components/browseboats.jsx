import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import SearchAndFilterBoats from './searchandfilterboats';
import BoatCards from './boatcards';
import { applyFilters, sortAndPaginate } from '../util/oganoutils';
import { getFilterable } from './boatregisterposts';
import BoatRegisterIntro from "./boatregisterintro";
import BoatsForSaleIntro from "./boatsforsaleintro";
import SmallBoatsIntro from "./smallboatsintro";
import LoginButton from './loginbutton';
import CreateBoatButton from './createboatbutton';
import ShuffleBoatsButton from './shuffleboats';
import YearbookButton from './yearbookbutton';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { ExpandMoreOutlined } from '@mui/icons-material';
import { Box } from '@mui/system';

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

function Intro({ view }) {
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
  const { bpp, sort, sortDirection, filters } = state;
  const [data, setData] = useState();

  useEffect(() => {
    if (!data) {
      getFilterable().then((r) => setData(r.data)).catch((e) => console.log(e));
    }
  }, [data]);

  if (!data) return <CircularProgress />;

  const blank = "_blank";

  const filtered = applyFilters(data, filters);
  const pickers = makePickers(filtered);

  return (
    <Box sx={{ overflowX: 'hidden'}}>
      <Stack 
      direction='row' spacing={2}
      alignItems='center' justifyContent='space-evenly' 
      sx={{ height: '76px', backgroundColor: 'rgb(219, 235, 255)' }}
      >
        <CreateBoatButton />
        <YearbookButton />
        <ShuffleBoatsButton />
        <LoginButton/>
      </Stack>
      <Accordion defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreOutlined/>}>
          <Typography>About the boat Register</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Intro view={state.view} />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreOutlined/>}>
          <Typography>Sort and Filter</Typography>
        </AccordionSummary>
        <AccordionDetails>
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
      </AccordionDetails>
      </Accordion>
      <BoatCards
        state={state}
        boats={sortAndPaginate(filtered, state)}
        totalCount={filtered.length}
        onChangePage={onPageChange}
        onBoatMarked={onBoatMarked}
        onBoatUnMarked={onBoatUnMarked}
      />
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
    </Box>
  );
}

BrowseBoats.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};
