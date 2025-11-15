import React from "react";
import Divider from "@mui/material/Divider";
import FilterBoats from "./filterboats";
import SortingAndPagination from "./sortingandpagination";

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
      <SortingAndPagination
        sortDirection={sortDirection}
        sortField={sortField}
        boatsPerPage={boatsPerPage}
        view={view}
        onSortChange={onSortChange}
        onPageSizeChange={onPageSizeChange}
      />
      <Divider />
      <FilterBoats
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
