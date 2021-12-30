import React, { useState, useEffect } from "react";
import GqlBoatBrowser from "./components/GqlBoatBrowser";
import BoatRegisterIntro from "./components/boatregisterintro";
import BoatsForSaleIntro from "./components/boatsforsaleintro";
import SmallBoatsIntro from "./components/smallboatsintro";

export default function App({variant}) {
  const [state, setState] = useState(JSON.parse(sessionStorage.getItem("BOAT_BROWSE_STATE"))||{ bpp: '12', p: '1'});
  
  useEffect(() => {
    sessionStorage.setItem("BOAT_BROWSE_STATE", JSON.stringify(state));
  }, [state]);

  const handlePageSizeChange = (bpp) => {
    console.log("page size change", bpp);
    setState({p:'1', bpp: `${bpp}`});
  };

  const handleSortChange = (field, dir) => {
    console.log("sortchange", field, dir);
    setState({...state, sort: field, asc: `${dir==='asc'}`});
  };

  const handleFilterChange = (filters) => {
    console.log("filter change", filters);
    setState({...state, p:'1', filters});
  };

  const handlePageChange = ({page}) => {
    console.log("page change", page);
    setState({...state, p: `${page}`});
  };

  const BB = ({title, state}) => {
    return (
      <GqlBoatBrowser
        title={title}
        state={state}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
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
