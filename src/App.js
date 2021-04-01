import React, { useState } from "react";
import { CookiesProvider } from "react-cookie";
import { Link, Router, Route } from "@ogauk/link-router";
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

export default function App() {

  const [page, setPage] = useState(1);
  const [bpp, setBpp] = useState(12);

  const handlePageSizeChange = (bpp) => {
    console.log("page size change", bpp);
    setBpp(bpp);
    setPage(1);
  };

  const handleSortChange = (field, dir) => {
    console.log("sortchange", field, dir);
  };

  const handleFilterChange = (filters) => {
    console.log("filter change", filters);
    setPage(1);
  };

  const handlePageChange = (page) => {
    console.log("page change", page);
    setPage(page);
  };

  return (
    <CookiesProvider>
      <OGAProvider>
        <Router>
          <Route
            state={{...browse, p: page, bpp}}
            path="/boat_register/boat_register.html"
          >
            <BoatRegisterIntro />
            <GqlBoatBrowser
              title="Browse the Register"
              onPageSizeChange={handlePageSizeChange}
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
              onPageChange={handlePageChange}
              link={Link}
            />
          </Route>
          <Route
            state={{...buy, p: page, bpp}}
            path="/boat_register/boats_for_sale/(?:test_)?boats_for_sale.*"
          >
            <BoatsForSaleIntro />
            <GqlBoatBrowser
              title="Boats for Sale"
              onPageSizeChange={handlePageSizeChange}
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
              onPageChange={handlePageChange}
              link={Link}
            />
          </Route>
          <Route
            state={{...small, p: page, bpp}}
            path="/boat_register/small_boats/(?:test_)?small_boats.*"
          >
            <SmallBoatsIntro />
            <GqlBoatBrowser
              title="Boats for Sale"
              onPageSizeChange={handlePageSizeChange}
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
              onPageChange={handlePageChange}
              link={Link}
            />
          </Route>
          <Route
            state={{...browse, p: page, bpp}}
            path="/boat_register/browse_the_register/(?:test_)?browse_the_register.*"
          >
            <BoatRegisterIntro />
            <GqlBoatBrowser
              title="Browse the Register"
              onPageSizeChange={handlePageSizeChange}
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
              onPageChange={handlePageChange}
              link={Link}
            />
          </Route>
          <Route path="/boat_register/browse_the_register/(?:test_)?boat.*">
            <Boat />
          </Route>
        </Router>
      </OGAProvider>
    </CookiesProvider>
  );
}
