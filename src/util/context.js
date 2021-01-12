import { home as reactrouterdomHome, boatLink as reactrouterdomBoatLink } from './rr';
import { home as gatsbyHome, boatLink as gatsbyBoatLink  } from './gr';

export function boatUrl(oga_no) {
    return `https://www.oga.org.uk/boat_register/browse_the_register/boat.html?oga_no=${oga_no}`;
}

  /*
  const home = location.pathname
    ?reactrouterdomHome(location)
    :gatsbyHome(location);

{
    pathname: "/browse_the_register/boat.html", 
    search: "?oga_no=3212&p=1&bpp=6&sort=editors_choice&asc=true&sale=false", 
    hash: "", 
    state: {key: "1610418091294"}
    href: "http://localhost:8000/browse_the_register/boat.htm…p=1&bpp=6&sort=editors_choice&asc=true&sale=false", 
    origin: "http://localhost:8000",
    port: "8000"
    protocol: "http:"
}

{​
    pathname: "/boat/3212"
    search: ""
    hash: ""
    state: {
        boatsPerPage: "12"
        filters: {
            sale: false
        ​​}
        page: 1
        sortDirection: "asc"
        sortField: "editors_choice"
    }
    key: "9scbbt"
}
    */
export function home(location) {
    if (location.key) {
        return reactrouterdomHome(location);
    }
    return gatsbyHome(location);
}

  /*
  const boatLink = location.pathname
                    ?reactrouterdomBoatLink(state, boat.oga_no)
                    :gatsbyBoatLink(state, boat.oga_no);
*/
export function boatLink(state, oga_no) {
    return reactrouterdomBoatLink(state, oga_no);
}
