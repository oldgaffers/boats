import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
// import StaticPickerBoatBrowser from "./components/StaticPickerBoatBrowser";
import BrowseBoats from "./browseboats";
import { getState, saveState, setView } from "../util/statemanagement";
import { useAuth0 } from "@auth0/auth0-react";
import { getFleets } from "../util/api";

export const MarkContext = createContext([]);
export const OwnedContext = createContext([]);

export default function BrowseApp({ view = 'app' }) {
  setView(view);
  const [state, setState] = useState(getState(view));
  const [markList, setMarkList] = useState([]);
  const [markedOnly, setMarkedOnly] = useState(false);
  const [fleets, setFleets] = useState();

  const accessToken = useContext(TokenContext);
  const { user } = useAuth0()
  const id = user?.["https://oga.org.uk/id"];

  useEffect(() => {
    const getData = async () => {
      const p = await getFleets('public', { public: true }, accessToken);
      const q = await getFleets('member', { owner_gold_id: id }, accessToken);
      setFleets([...p, ...q]);
    }
    if (accessToken && !fleets) {
      getData();
    }
  }, [accessToken, fleets, id])


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

  const handleFleetChange = () => {
    setFleets(undefined);
  };

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

  const handleClearAllMarks = () => {
    // console.log('handle clear all marks');
    setMarkList([]);
    setMarkedOnly(false);
    updateOgaNosFilter([], false);
  }

  return (
    <MarkContext.Provider value={markList}>
      <BrowseBoats
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        onMarkedOnlyChange={handleMarkedOnlyChange}
        onClearAllMarks={handleClearAllMarks}
        onFleetChange={handleFleetChange}
        onBoatMarked={handleBoatMarked}
        onBoatUnMarked={handleBoatUnMarked}
        isMarkedOnly={markedOnly}
        state={state}
        fleets={fleets}
      />
    </MarkContext.Provider>
  );
}
