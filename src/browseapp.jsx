import React, { useState, useEffect, useCallback, useRef } from "react";
import GqlBoatBrowser from "./components/GqlBoatBrowser";
import BoatRegisterIntro from "./components/boatregisterintro";
import BoatsForSaleIntro from "./components/boatsforsaleintro";
import SmallBoatsIntro from "./components/smallboatsintro";

export default function App({ variant }) {
  const [state, setState] = useState(JSON.parse(sessionStorage.getItem("BOAT_BROWSE_STATE"))||{ bpp: '12', p: '1'});
  const [markedOnly, setMarkedOnly] = useState(false);

  const markSet = useRef(new Set());

  useEffect(() => {
    sessionStorage.setItem("BOAT_BROWSE_STATE", JSON.stringify(state));
  }, [state]);

  const handlePageSizeChange = (bpp) => {
    setState({p:'1', bpp: `${bpp}`});
  };

  const handleSortChange = (field, dir) => {
    setState({...state, sort: field, asc: `${dir==='asc'}`});
  };

  const handlePageChange = ({page}) => {
    setState({...state, p: `${page}`});
  };

  const handleFilterChange = useCallback((filters) => {
    console.log('handleFilterChange', filters);
    setState({...state, p:'1', filters});
  }, [state]);

  const handleMarkedOnlyChange = useCallback((isMarkedOnly) => {
    setMarkedOnly(isMarkedOnly);
    const markList = [...markSet.current];
    if (isMarkedOnly) {
      console.log('only marked', markList, state.filters);
      handleFilterChange({ ...state.filters, oga_nos: markList });
    } else {
      const { oga_nos, ...f } = state.filters;
      console.log('not only marked', [...markSet.current], f);
      if (oga_nos) {
        handleFilterChange(f);
      }
    }
  }, [state, handleFilterChange]);

  const handleBoatMarked = (ogaNo) => {
    markSet.current.add(ogaNo);
    console.log('marked', [...markSet.current]);
  };

  const handleBoatUnMarked = (ogaNo) => {
    markSet.current.delete(ogaNo);
    console.log('marked', [...markSet.current]);
    if (markedOnly) {
      console.log('should remove from filter');
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

  const Browse = props => {
    return (
      <>
      <BoatRegisterIntro />
      <BB title="Browse the Register" state={{sort: "rank", asc: "true", ...state}} {...props} />
      </>
    );
  }
  
  const Sell = props => {
    return (
      <>
        <BoatsForSaleIntro />
        <BB
          title="Boats for Sale"
          state={{
            sort: "price",
            asc: "false",
            v_sale: "true", 
            ...state,
          }} 
          {...props}
        />
      </>
    );
  }
  
  const Small = props => {
    return (
      <>
        <SmallBoatsIntro />
        <BB
          title="Browse our small boats"
          state={{
            sort: "rank",
            asc: "true",
            v_generic_type: "Dinghy|Dayboat",
            ...state,
          }}
          {...props}
        />
      </>
    );
  }

  if (variant === 'sell') {
    return (<Sell/>);
  }
  if (variant === 'small') {
    return (<Small/>);
  }
  return (<Browse/>);
}
