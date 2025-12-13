import React, { createContext, useState, useEffect, useCallback } from "react";
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

  // const accessToken = useContext(TokenContext);
  const { user, getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    const getData = async (accessToken) => {
      const id = user?.["https://oga.org.uk/id"];
      const f = await getFleets('public', { public: true }, accessToken);
      if (id) {
        const q = await getFleets('member', { owner_gold_id: id }, accessToken);
        f.push(...q);
      }
      return f;
    }
    if (!fleets) {
      getAccessTokenSilently(
        // {
        //   authorizationParams: {
        //     audience: 'https://oga.org.uk/boatregister', 
        //     scope: 'email',
        // }}
      )
        .then((accessToken) => {
        getData(accessToken).then((data) => {
          console.log('got fleets');
          setFleets(data);
        }).catch((e) => {
          console.error('Error fetching fleets:', e);
        });
      }).catch((e) => {
        console.error('Error getting access token for fleets:', e);
      });
    }
  }, [getAccessTokenSilently, fleets, user])

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
    console.log('fleet change, refetching and clearing marks');
    setFleets(undefined);
    setMarkList([]);
    setMarkedOnly(false);
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
