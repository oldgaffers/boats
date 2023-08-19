import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Accordion, AccordionDetails, AccordionSummary, Stack } from '@mui/material';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import CreateBoatButton from './createboatbutton';
import ShuffleBoatsButton from './shuffleboats';
import LoginButton from './loginbutton';
import RoleRestricted from './rolerestrictedcomponent';
import SearchAndFilterBoats from './searchandfilterboats';
import BoatCards from './boatcards';
import { applyFilters, sortAndPaginate } from '../util/oganoutils';
import { getFilterable } from './boatregisterposts';
import BoatRegisterIntro from "./boatregisterintro";
import BoatsForSaleIntro from "./boatsforsaleintro";
import BoatsToSailIntro from "./boatstosailintro";
import SmallBoatsIntro from "./smallboatsintro";
import { ExportFleet } from './exportfleet';

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
    const l = new Set();
    filtered.forEach((boat) => {
      const v = boat[key];
      if (Array.isArray(v)) {
        v.forEach((i) => l.add(i));
      } else {
        l.add(v);
      }
    });
    pickers[key] = [...l].filter((v) => v);
    pickers[key].sort();
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
  let IntroText = BoatRegisterIntro;
  if (view === 'sell') {
    IntroText = BoatsForSaleIntro;
  }
  if (view === 'small') {
    IntroText = SmallBoatsIntro;
  }
  if (view === 'sail') {
    IntroText = BoatsToSailIntro;
  }
  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandCircleDownIcon />}>
        <Typography>About the boat Register</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <IntroText />
      </AccordionDetails>
    </Accordion>
  );
}

function ExportOptions({ name, boats, filters }) {
  if (name) {
    return  <ExportFleet name={name} boats={boats} filters={filters} />
  }
  return '';
}

export default function BrowseBoats({
  state,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onFilterChange,
  onMarkedOnlyChange,
  onClearAllMarks,
  isMarkedOnly,
  onBoatMarked,
  onBoatUnMarked,
}) {
  const { bpp, sort, sortDirection, filters } = state;

  const [data, setData] = useState();
  const [ownedOnly, setOwnedOnly] = useState();
  const { user } = useAuth0();
  const [fleetName, setFleetName] = useState();

  useEffect(() => {
    if (!data) {
      getFilterable().then((r) => {
        console.log(r);
        setData(r);
      }).catch((e) => console.log(e));
    }
  }, [data]);

  const handleFilterChange = (filters, name) => {
    onFilterChange(filters);
    setFleetName(name);
  }

  if (!data) return <CircularProgress />;

  const blank = "_blank";

  const id = user?.["https://oga.org.uk/id"];
  const ownedBoats = data.filter((b) => b.owners?.includes(id));
  let boats = data;
  if (ownedOnly && ownedBoats.length > 0) {
    boats = ownedBoats;
  }
  const filtered = applyFilters(boats, filters);
  const pickers = makePickers(filtered);
  const enableOwnersOnly = ownedBoats.length > 0;
  // sx={{ height: '76px', backgroundColor: 'rgb(219, 235, 255)' }}
  return (
    <Paper>
      <Stack
        direction='row' spacing={2}
        alignItems='center' justifyContent='space-evenly'
      >
        <CreateBoatButton />
        <RoleRestricted role='editor'>
          <ShuffleBoatsButton />
        </RoleRestricted>
        <LoginButton />
      </Stack>
      <Intro view={state.view} />
      <Accordion defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandCircleDownIcon />}>
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
            onFilterChange={handleFilterChange}
            onMarkedOnlyChange={onMarkedOnlyChange}
            onClearAllMarks={onClearAllMarks}
            isMarkedOnly={isMarkedOnly}
            onOwnedOnlyChange={(v) => setOwnedOnly(v)}
            isOwnedOnly={ownedOnly}
            enableOwnersOnly={enableOwnersOnly}
            filtered={filtered}
          />
          <ExportOptions boats={filtered} filters={filters} name={fleetName} />
        </AccordionDetails>
      </Accordion>
      <Divider />
      <BoatCards
        state={state}
        boats={sortAndPaginate(filtered, state)}
        totalCount={filtered.length}
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
