import React from "react";
import { CookiesProvider } from "react-cookie";
import { Link, Router, Route } from "@ogauk/link-router";
import OGAProvider from "./util/gql";
import GqlBoatBrowser from "./components/GqlBoatBrowser";
import Boat from "./components/boat";
import BoatsForSaleIntro from "./components/boatsforsaleintro";
import BoatRegisterIntro from "./components/boatregisterintro";

const browse = {
  p: "1",
  bpp: "12",
  sort: "rank",
  asc: "true",
  f_sale: "false",
};

const buy = {
  p: "1",
  bpp: "12",
  sort: "price",
  asc: "false",
  f_sale: "true",
};

const handlePageSizeChange = (bpp) => {
  console.log("page size change", bpp);
};

const handleSortChange = (field, dir) => {
  console.log("sortchange", field, dir);
};

const handleFilterChange = (filters) => {
  console.log("filter change", filters);
};

const handlePageChange = (page) => {
  console.log("page change", page);
};

export default function App() {
  return (
    <CookiesProvider>
      <OGAProvider>
        <Router>
          <Route
            state={browse}
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
            state={buy}
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
            state={browse}
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
