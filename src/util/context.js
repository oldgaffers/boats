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
    href: "http://localhost:8000/browse_the_register/boat.htm…p=1&bpp=6&sort=editors_choice&asc=true&sale=false", 
    origin: "http://localhost:8000",
    pathname: "/browse_the_register/boat.html"
    port: "8000"
    protocol: "http:"
    search: "?oga_no=3212&p=1&bpp=6&sort=editors_choice&asc=true&sale=false"
    state: {key: "1610418091294"}
}


    */
export function home(location) {
    console.log('home', location);
       return reactrouterdomHome(location);
}

  /*
  const boatLink = location.pathname
                    ?reactrouterdomBoatLink(state, boat.oga_no)
                    :gatsbyBoatLink(state, boat.oga_no);
*/
export function boatLink(state, oga_no) {
    return reactrouterdomBoatLink(state, oga_no);
}
