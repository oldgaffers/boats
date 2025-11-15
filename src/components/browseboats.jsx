import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack } from '@mui/material';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import CreateBoatButton from './createboatbutton';
import ShuffleBoatsButton from './shuffleboats';
import RoleRestricted from './rolerestrictedcomponent';
import SearchAndFilterBoats from './searchandfilterboats';
import BoatCards from './boatcards';
import { IntroText } from "./Intro";
import { applyFilters, sortAndPaginate } from '../util/oganoutils';
import { ExportFleet } from './exportfleet';
import BoatRegisterFooter from './BoatRegisterFooter';
import { useBoats } from '../util/boats';
import Welcome from './Welcome';

function makePickers(filtered) {
  // console.log('PB', filtered);
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
    "place_built",
    "home_port",
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
  // console.log('P', pickers);
  return pickers;
}

function ExportOptions({ name, boats, filters }) {
  if (name) {
    return  <ExportFleet name={name} boats={boats} filters={filters} />
  }
  return '';
}

export default function BrowseBoats({
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onFilterChange,
  onMarkedOnlyChange,
  onClearAllMarks,
  isMarkedOnly,
  onBoatMarked,
  onBoatUnMarked,
  onFleetChange,
  state,
  fleets,
}) {
  const { bpp, sort, sortDirection, filters } = state;
  const [ownedOnly, setOwnedOnly] = useState();
  const [fleetName, setFleetName] = useState();
  const { user } = useAuth0();
  const id = user?.["https://oga.org.uk/id"];

  const boats = useBoats(id, ownedOnly);

  const handleFilterChange = (filters, name) => {
    onFilterChange(filters);
    setFleetName(name);
  }

  if (!boats) return <CircularProgress />;

  const filtered = applyFilters(boats, filters);
  const pickers = makePickers(filtered);

  return (
   <Box>
      <Stack direction='row' spacing={2} margin={2}>
        <Welcome/>
        <Box maxHeight={200}>
          <RoleRestricted role='editor'>
            <ShuffleBoatsButton />
          </RoleRestricted>
        </Box>
      </Stack>
      <Accordion defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandCircleDownIcon />}>
          <Typography>About the boat Register</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <IntroText view={state.view}/>
          <Box maxHeight={200}>
            <CreateBoatButton />
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandCircleDownIcon />}>
          <Typography>Sort and Paginate</Typography>
        </AccordionSummary>
        <AccordionDetails>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandCircleDownIcon />}>
          <Typography>Filter</Typography>
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
            onFleetChange={onFleetChange}
            isMarkedOnly={isMarkedOnly}
            onOwnedOnlyChange={(v) => setOwnedOnly(v)}
            isOwnedOnly={ownedOnly}
            enableOwnersOnly={!!id}
            filtered={filtered}
            fleets={fleets}
            fleetName={fleetName}
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
      <BoatRegisterFooter />
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
