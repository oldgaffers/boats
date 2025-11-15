import React, { useState, useEffect, useContext } from "react";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormHelperText from "@mui/material/FormHelperText";
import { Button, Typography } from "@mui/material";
import Picker from "./picker";
import NumberEntry from "./numberentry";
import DateRangePicker from "./daterangepicker";
import useDebounce from "../util/debounce";
import FleetButtons from "./fleetbuttons";
import { MarkContext } from "./browseapp";
import RoleRestricted from './rolerestrictedcomponent';

const opposite = { asc: "desc", desc: "asc" };

const pageSize = [];
for (let i = 1; i <= 8; i++) {
  pageSize.push({ name: `${6 * i}` });
}

function makePicklist(view, pickers, field) {
  if (pickers[field] && pickers[field].length > 0) {
    const p = pickers[field]
    const pl = [...new Set(p)].map((item) => ({ name: item }));
    return pl;
  }
  return [];
}

export default function SearchAndFilterBoats({
  sortDirection,
  sortField,
  boatsPerPage,
  filters,
  view,
  pickers,
  onFilterChange,
  onPageSizeChange,
  onSortChange,
  onMarkedOnlyChange,
  isMarkedOnly,
  onClearAllMarks,
  onOwnedOnlyChange,
  isOwnedOnly,
  enableOwnersOnly,
  filtered,
  fleets,
  fleetName,
}) {

  return (
    <form>
      <SortAndPaginate
        sortDirection={sortDirection}
  sortField={sortField}
  boatsPerPage={boatsPerPage}
  view={view}
  onSortChange={onSortChange}
  onPageSizeChange={onPageSizeChange}
      />
      <Divider />
      <SetFilters
      filters={filters}
  view={view}
  pickers={pickers}
  onFilterChange={onFilterChange}
  onMarkedOnlyChange={onMarkedOnlyChange}
  isMarkedOnly={isMarkedOnly}
  onClearAllMarks={onClearAllMarks}
  onOwnedOnlyChange={onOwnedOnlyChange}
  isOwnedOnly={isOwnedOnly}
  enableOwnersOnly={enableOwnersOnly}
  filtered={filtered}
  fleets={fleets}
  fleetName={fleetName}
      />
    </form>
  );
}
