import React, { useState, useEffect } from "react";
import { CookiesProvider } from "react-cookie";
import { Router } from "@reach/router"
import OGAProvider from "./util/gql";
import GqlBoatBrowser from "./components/GqlBoatBrowser";
import Boat from "./components/boat";
import BoatsForSaleIntro from "./components/boatsforsaleintro";
import BoatRegisterIntro from "./components/boatregisterintro";
import SmallBoatsIntro from "./components/smallboatsintro";

const browse = {
  sort: "rank",
  asc: "true",
};

const buy = {
  sort: "price",
  asc: "false",
  v_sale: "true",
};

const small = {
  sort: "rank",
  asc: "true",
  v_generic_type: "Dinghy|Dayboat",
};

function Browse(props) {
  return (
    <>
    <BoatRegisterIntro />
    <GqlBoatBrowser
      title="Browse the Register"
      {...props}
    />
    </>
  );
}

function Buy(props) {
  return (
    <>
    <BoatsForSaleIntro />
    <GqlBoatBrowser
      title="Boats for Sale"
      {...props}
    />
    </>
  );
}

function Small(props) {
  return (
    <>
    <SmallBoatsIntro />
    <GqlBoatBrowser
      title="Browse our small boats"
      {...props}
    />
    </>
  );
}

const Home = props => (
  <>
    {props.children}
  </>
)

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

  return (
    <CookiesProvider>
      <OGAProvider>
        <Router>
          <Browse            
            path="/"
            onPageSizeChange={handlePageSizeChange}
            onSortChange={handleSortChange}
            onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
            state={{...browse, ...state}}
          />
          <Home path="/boat_register">
          <Browse            
            path="boat_register.html"
            onPageSizeChange={handlePageSizeChange}
            onSortChange={handleSortChange}
            onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
            state={{...browse, ...state}}
          />
          <Home path="browse_the_register">
            <Browse            
              path="browse_the_register.html"
              onPageSizeChange={handlePageSizeChange}
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
              onPageChange={handlePageChange}
              state={{...browse, ...state}}
            />
            <Browse            
              path="test_browse_the_register.html"
              onPageSizeChange={handlePageSizeChange}
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
              onPageChange={handlePageChange}
              state={{...browse, ...state}}
            />
            <Boat path="boat.html"/>
            <Boat path="test_boat.html"/>
          </Home>
          <Buy            
            path="boats_for_sale/boats_for_sale.html"
            onPageSizeChange={handlePageSizeChange}
            onSortChange={handleSortChange}
            onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
            state={{...buy, ...state}}
          />
          <Small            
            path="small_boats/small_boats.html"
            onPageSizeChange={handlePageSizeChange}
            onSortChange={handleSortChange}
            onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
            state={{...small, ...state}}
          />
          </Home>
        </Router>
      </OGAProvider>
    </CookiesProvider>
  );
}
