import React, { useState, useEffect, useCallback, useRef } from "react";
import GqlBoatBrowser from "./components/GqlBoatBrowser";
import BoatRegisterIntro from "./components/boatregisterintro";
import BoatsForSaleIntro from "./components/boatsforsaleintro";
import SmallBoatsIntro from "./components/smallboatsintro";

const DEFAULT_BOAT_BROWSE_STATE = { bpp: 12, page: 1, sort: 'rank', sortDirection: 'asc' };

function sessionStore() {
  const ss = sessionStorage.getItem("BOAT_BROWSE_STATE")
  if (ss) {
    const parsed = JSON.parse(ss);
    if (parsed.sortDirection) { // new layout
      return parsed;
    }
    return DEFAULT_BOAT_BROWSE_STATE; // old layout
  }
  return DEFAULT_BOAT_BROWSE_STATE; // new session
}

export default function App({ variant }) {
  const [state, setState] = useState({...sessionStore(), view: variant||'boat'});

  const markedOnly = !!(state.filters && state.filters.oga_nos);
  const markSet = useRef(new Set());

  useEffect(() => {
    console.log('storing state');
    sessionStorage.setItem("BOAT_BROWSE_STATE", JSON.stringify(state));
  }, [state]);

  const handlePageSizeChange = (bpp) => {
    setState({...state, page: 1, bpp });
  };

  const handleSortChange = (field, dir) => {
    setState({...state, sort: field, asc: dir === 'asc'});
  };

  const handlePageChange = ({page}) => {
    setState({...state, page });
  };

  const handleFilterChange = useCallback((filters) => {
    setState({...state, page: 1, filters});
  }, [state]);

  const handleMarkedOnlyChange = useCallback((isMarkedOnly) => {
    const markList = [...markSet.current];
    if (isMarkedOnly) {
      handleFilterChange({ ...state.filters, oga_nos: markList });
    } else {
      const { oga_nos, ...f } = state.filters;
      if (oga_nos) {
        handleFilterChange(f);
      }
    }
  }, [state, handleFilterChange]);

  const handleBoatMarked = (ogaNo) => {
    markSet.current.add(ogaNo);
  };

  const handleBoatUnMarked = (ogaNo) => {
    markSet.current.delete(ogaNo);
    if (markedOnly) {
      handleFilterChange({ ...state.filters, oga_nos: [...markSet.current] });
    }
  };

  const BB = ({title, state}) => {
    return (
      <GqlBoatBrowser
        title={title}
        state={state}
        markList={[...markSet.current]}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        onMarkedOnlyChange={handleMarkedOnlyChange}
        isMarkedOnly={markedOnly}
        onBoatMarked={handleBoatMarked}
        onBoatUnMarked={handleBoatUnMarked}
      />
    );
  }

  switch (state.view) {
    case 'sell':
    return (<>
      <BoatsForSaleIntro />
      <BB
        title="Boats for Sale"
        state={{
          // price/descending is an initial decision, not fixed/forced
          ...state,
          sort: 'price', 
          sortDirection: 'desc',
          filters: { sale: true }
        }} 
      />
    </>);
    case 'small':
    return (
      <>
        <SmallBoatsIntro />
        <BB
          title="Browse our small boats"
          state={{
            ...state,
            filters: { generic_type:  ['Dinghy', 'Dayboat'] },
          }}
        />
      </>
    );
  default:
  return (<>
    <BoatRegisterIntro />
    <BB title="Browse the Register" state={state}/>
    </>);
  }
}
