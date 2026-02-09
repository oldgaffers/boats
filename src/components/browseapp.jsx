import React, { createContext, useState, useEffect, useCallback } from "react";
// import StaticPickerBoatBrowser from "./components/StaticPickerBoatBrowser";
import BrowseBoats from "./browseboats";
import { getState, saveState, setView } from "../util/statemanagement";

export const MarkContext = createContext([]);
export const OwnedContext = createContext([]);

export default function BrowseApp({ view = 'app' }) {
  setView(view);
  const [state, setState] = useState(getState(view));
  const [markList, setMarkList] = useState([]);
  const [markedOnly, setMarkedOnly] = useState(false);
  const [fleets, setFleets] = useState();
  const [fleetName, setFleetName] = useState();

  useEffect(() => { saveState(state, view); }, [state, view]);

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

  const handleFilterChange = useCallback((newFilters) => {
    const { filters } = getState(view);
    const f = { ...newFilters, ...filters };
    setState({ ...state, page: 1, filters: f });
  }, [state]);

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
    </MarkContext.Provider>
  );
}
