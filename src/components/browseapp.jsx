import React, { createContext, useState, useEffect } from "react";
import BrowseBoats from "./browseboats";
import { DEFAULT_BROWSE_STATE } from "../util/statemanagement";
import { Stack } from "@mui/material";

export const MarkContext = createContext([]);
export const OwnedContext = createContext([]);

export default function BrowseApp({ view = 'app' }) {
  const [state, setState] = useState(DEFAULT_BROWSE_STATE[view]);
  const [markList, setMarkList] = useState([]);
  const [markedOnly, setMarkedOnly] = useState(false);
  const [fleets, setFleets] = useState();
  const [fleetName, setFleetName] = useState();

  // useEffect(() => { saveState(state, view); }, [state, view]);

  useEffect(() => {
    if (markList.length === 0) {
      setMarkedOnly(false);
    }
  }, [markList]);

  useEffect(() => {
    if (fleetName) {
      const fleet = fleets?.find((f) => f.name === fleetName);
      if (fleet) {
        console.log(`Applying filters from fleet "${fleetName}":`, fleet.filters);
        setState({ ...state, page: 1, filters: fleet.filters });
      } else {
        console.warn(`Selected fleet "${fleetName}" not found in fleets list.`);
      }
    } else {
      setState({ ...state, page: 1, filters: {} });
    }
  }, [fleets, fleetName, markedOnly, state.filters.oga_nos]);

  const handlePageSizeChange = (bpp) => {
    setState({ ...state, page: 1, bpp });
  };

  const handleSortChange = (field, dir) => {
    setState({ ...state, sort: field, sortDirection: dir });
  };

  const handlePageChange = ({ page }) => {
    setState({ ...state, page });
  };

  const handleFilterChange = (newFilters) => {
    const { filters } = DEFAULT_BROWSE_STATE[view];
    // alert(`view filters for ${view} are ${JSON.stringify(filters)}`);
    const f = { ...newFilters, ...filters };
    setState({ ...state, page: 1, filters: f });
  };

  const handleBoatMarked = (ogaNo) => {
    if (!markList.includes(ogaNo)) {
      setMarkList([...markList, ogaNo]);
    }
  };

  const handleBoatUnMarked = (ogaNo) => {
    setMarkList(markList.filter((n) => n !== ogaNo));
  };

  const handleFleetChanges = (fleets, type) => {
    setFleets(fleets);
    if (type === 'static') {
      setMarkList([]);
    }
  }

  return (
    <MarkContext.Provider value={markList}>
    <Stack>
      <BrowseBoats
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        onMarkedOnlyChange={(isMarkedOnly) => setMarkedOnly(isMarkedOnly)}
        onClearAllMarks={() => setMarkList([])}
        onBoatMarked={handleBoatMarked}
        onBoatUnMarked={handleBoatUnMarked}
        isMarkedOnly={markedOnly}
        state={state}
        onFleetChanges={handleFleetChanges}
        fleets={fleets}
        fleetName={fleetName}
        onFleetSelected={(name) => setFleetName(name)}
      />
      <pre>{JSON.stringify(state, null, 2)}</pre>
      </Stack>
    </MarkContext.Provider>
  );
}
