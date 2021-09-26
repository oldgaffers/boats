import React, { useState, useEffect } from "react";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import OGAProvider from "./util/gql";
import GqlBoatBrowser from "./components/GqlBoatBrowser";
import Boat from "./components/boat";
import BoatsForSaleIntro from "./components/boatsforsaleintro";
import BoatRegisterIntro from "./components/boatregisterintro";
import SmallBoatsIntro from "./components/smallboatsintro";

export default function App(props) {
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
  return (
    <CookiesProvider>
      <OGAProvider>
        <Router>
          <Switch>
          <Route component={Browse} path="/" exact /> 
          <Route component={Browse} path="/boat_register" exact/> 
          <Route component={Browse} path="/boat_register/index.html" exact/> 
          <Route component={Browse} path="/boat_register/boat_register.html" exact/> 
          <Route component={Browse} path="/browse_the_register" exact/> 
          <Route component={Browse} path="/browse_the_register/index.html" exact/> 
          <Route component={Browse} path="/browse_the_register/boat_register.html" exact/> 
          <Route component={Browse} path="/browse_the_register/test_boat_register.html" exact/>
          <Route component={Browse} path="/boat_register/browse_the_register" exact/>
          <Route component={Browse} path="/boat_register/browse_the_register/index.html" exact/>
          <Route component={Browse} path="/boat_register/browse_the_register/browse_the_register.html" exact/>
          <Route component={Browse} path="/boat_register/browse_the_register/test_browse_the_register.html" exact/>
          <Route component={Boat} path="/boat" exact/>
          <Route component={Boat} path="/boat/index.html" exact/> 
          <Route component={Boat} path="/boat_register/boat" exact/> 
          <Route component={Boat} path="/boat_register/boat/index.html" exact/> 
          <Route component={Boat} path="/boat_register/test_boat" exact/> 
          <Route component={Boat} path="/boat_register/test_boat/index.html" exact/>
          <Route component={Boat} path="/boat_register/boat.html" exact/> 
          <Route component={Boat} path="/boat_register/test_boat.html" exact/> 
          <Route component={Buy} path="/boats_for_sale/boats_for_sale.html" exact/> 
          <Route component={Buy} path="/boats_for_sale" exact/> 
          <Route component={Buy} path="/boats_for_sale/index.html" exact/> 
          <Route component={Small} path="/small_boats/small_boats.html" exact/> 
          <Route component={Small} path="/small_boats/index.html" exact/> 
          <Route component={Small} path="/small_boats" exact/>
          </Switch>
        </Router>
      </OGAProvider>
    </CookiesProvider>
  );
}
