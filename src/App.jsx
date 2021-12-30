import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OGAProvider from "./util/gql";
import GqlBoatBrowser from "./components/GqlBoatBrowser";
import Boat from "./components/boat";
import BoatsForSaleIntro from "./components/boatsforsaleintro";
import BoatRegisterIntro from "./components/boatregisterintro";
import SmallBoatsIntro from "./components/smallboatsintro";

const theme = createTheme();

export default function App() {
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
    console.log("APP page change", page);
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
  
  const Buy = props => {
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
  console.log('App');
  return (
    <CookiesProvider>
      <OGAProvider>
        <ThemeProvider theme={theme}>
          <Router>
            <Routes>
              <Route element={<Browse/>} path="/" exact /> 
              <Route element={<Browse/>} path="/boat_register/" exact /> 
              <Route element={<Buy/>} path="/boats_for_sale/index.html" exact/> 
              <Route element={<Small/>} path="/small_boats/index.html" exact/>
              <Route element={<Boat/>} path="/boat" exact/>
              <Route element={<Boat/>} path="/boat_register/boat" exact/>
            </Routes>
          </Router>
        </ThemeProvider>
      </OGAProvider>
    </CookiesProvider>
  );
}
