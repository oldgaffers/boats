import React, { createContext, useState, useEffect, useCallback } from "react";
// import StaticPickerBoatBrowser from "./components/StaticPickerBoatBrowser";
import BrowseBoats from "./components/browseboats";
import { getState, saveState, setView } from "./util/statemanagement";

export const MarkContext = createContext([]);
export const OwnedContext = createContext([]);

export default function BrowseApp({ view = 'app' }) {
  setView(view);
  const [state, setState] = useState(getState(view));
  const [markList, setMarkList] = useState([]);
  const [markedOnly, setMarkedOnly] = useState(false);

  useEffect(() => { saveState(state, view); }, [state, view]);

  const handlePageSizeChange = (bpp) => {
    setState({ ...state, page: 1, bpp });
  };

  const handleSortChange = (field, dir) => {
    setState({ ...state, sort: field, sortDirection: dir });
  };

  const handlePageChange = ({ page }) => {
    setState({ ...state, page });
  };

  const handleFilterChange = useCallback((filters) => {
    setState({ ...state, page: 1, filters });
  }, [state]);

  const updateOgaNosFilter = useCallback((l, mo) => {
    if (l.length === 0) {
      const { oga_nos, ...f } = state.filters;
      if (oga_nos) {
        handleFilterChange(f);
      }
      setMarkedOnly(false); // need to turn off the switch if nothing marked
    } else if (mo) {
      handleFilterChange({ ...state.filters, oga_nos: l });
    } else {
      // should be nothing to do
    }
  }, [handleFilterChange, state.filters]);

  const handleMarkedOnlyChange = useCallback((isMarkedOnly) => {
    if (isMarkedOnly) {
      updateOgaNosFilter(markList, true);
    } else {
      updateOgaNosFilter([], false);
    }
    setMarkedOnly(isMarkedOnly);
  }, [updateOgaNosFilter, markList]);

  const handleBoatMarked = (ogaNo) => {
    if (!markList.includes(ogaNo)) {
      const newMarkList = [...markList, ogaNo];
      setMarkList(newMarkList);
      updateOgaNosFilter(newMarkList, markedOnly);
    }
  };

  const handleBoatUnMarked = (ogaNo) => {
    const newMarkList = markList.filter((n) => n !== ogaNo);
    if (markedOnly) {
      updateOgaNosFilter(newMarkList, true);
    }
    setMarkList(newMarkList);
  };

  return (
    <MarkContext.Provider value={markList}>
      <BrowseBoats
        state={state}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        onMarkedOnlyChange={handleMarkedOnlyChange}
        isMarkedOnly={markedOnly}
        onBoatMarked={handleBoatMarked}
        onBoatUnMarked={handleBoatUnMarked}
      />
    </MarkContext.Provider>
  );
}
