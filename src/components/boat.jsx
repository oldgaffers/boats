import React, { useEffect } from 'react';
import BoatWrapper from './boatwrapper';
import useAxios from 'axios-hooks';

function upgradeBoat(b) {
  const handicap_data = b.handicap_data || {};
  if (b.beam) {
    handicap_data.beam = b.beam;
    delete b.beam;
  }
  if (b.length_on_deck) {
    handicap_data.length_on_deck = b.length_on_deck;
    delete b.length_on_deck;
  }
  b.handicap_data = handicap_data;
  return b;
}

// gql or axios
function getBoat(b) {
  if (b.data.boat) {
    return upgradeBoat(b.data.boat[0]);
  }
  return upgradeBoat(b.data.result.pageContext.boat);
}

export default function Boat({location}) {
  console.log('Boat');
  let oga_no = 1;
  if (location) {
    const params = new URLSearchParams(location.search);
    oga_no = params.get('oga_no');  
  }

  const [b] = useAxios(
    `https://ogauk.github.io/boatregister/page-data/boat/${oga_no}/page-data.json`
  )
  
  // const b = useQuery(query(oga_no));

  useEffect(() => {
    if (b.data) {
      const boat = getBoat(b);
      document.title = `${boat.name} (${boat.oga_no})`;
    }
  });

  if (b.loading) return <p>Loading...</p>
  if (b.error) {
      if (oga_no) {
          return (<div>
              Sorry, we had a problem getting the data for
              the boat with OGA number {oga_no}
              <p>Please try searching on the <a href={location.origin}>Main Page</a></p>
              </div>);
      } else {
          return (<div>
            <div>You've come to the boat detail viewer but we don't know what boat you wanted.</div>
            <div>If you are looking for boats for sale please visit <a href={location.origin+'/boat_register/boats_for_sale/boats_for_sale.html'}>Boats for Sale</a></div>
            <div>If you are looking interested in trailerable boats please visit <a href={location.origin+'/boat_register/small_boats/small_boats.html'}>Small Boats</a></div>
            <div>To browse our full register please visit <a href={location.origin+'/boat_register/browse_the_register/browse_the_register.html'}>All Boats</a></div>
              Otherwise please visit our <a href={location.origin}>Home Page</a>
            </div>);
      }
  }

  const boat = getBoat(b);
  return <BoatWrapper boat={boat} />;
};

