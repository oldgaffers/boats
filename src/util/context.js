import { home as reactrouterdomHome, boatLink as reactrouterdomBoatLink } from './rr';
import { home as gatsbyHome, boatLink as gatsbyBoatLink  } from './gr';

  /*
  const home = location.pathname
    ?reactrouterdomHome(location)
    :gatsbyHome(location);
    */
   export function home(location) {
       return gatsbyHome(location);
   }

  /*
  const boatLink = location.pathname
                    ?reactrouterdomBoatLink(state, boat.oga_no)
                    :gatsbyBoatLink(state, boat.oga_no);
*/
export function boatLink(state, oga_no) {
    return gatsbyBoatLink(state, oga_no);
}
