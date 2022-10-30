import React, { useEffect } from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import BoatWrapper from './boatwrapper';
import { useAxios } from 'use-axios-client';
import { boatRegisterHome } from '../util/constants';

function upgradeBoat(b) {
  if (!b) {
    return undefined;
  }
  const handicap_data = b?.handicap_data || {};
  if (b?.beam) {
    handicap_data.beam = b.beam;
    delete b.beam;
  }
  if (b?.length_on_deck) {
    handicap_data.length_on_deck = b.length_on_deck;
    delete b.length_on_deck;
  }
  b.handicap_data = handicap_data;
  return b;
}

// gql or axios
function getBoat(data) {
  if (data?.boat) {
    return upgradeBoat(data.boat[0]);
  }
  return upgradeBoat(data?.result?.pageContext?.boat);
}

export default function Boat({location={search:'?oga_no='}}) {
  const params = new URLSearchParams(location.search);
  const oga_no = params.get('oga_no') || '';  

  const { data, error, loading } = useAxios(
    `${boatRegisterHome}/boatregister/page-data/boat/${oga_no}/page-data.json`
  )

  useEffect(() => {
    if (data) {
      const boat = getBoat(data);
      document.title = `${boat.name} (${boat.oga_no})`;
    }
  });

  if (loading) return <CircularProgress/>
  if (error) {
      if (oga_no === '') {
        return (<div>
          <div>You've come to the boat detail viewer but we don't know what boat you wanted.</div>
          <div>If you are looking for boats for sale please visit <a href={location.origin+'/boat_register/boats_for_sale/'}>Boats for Sale</a></div>
          <div>If you are looking interested in trailerable boats please visit <a href={location.origin+'/boat_register/small_boats/'}>Small Boats</a></div>
          <div>To browse our full register please visit <a href={location.origin+'/boat_register/browse_the_register/'}>All Boats</a></div>
            Otherwise please visit our <a href={location.origin}>Home Page</a>
          </div>);
    } else {
        return (<div>
          Sorry, we had a problem getting the data for
          the boat with OGA number {oga_no}
          <p>Please try searching on the <a href={location.origin}>Main Page</a></p>
          </div>);
      }
  }

  const boat = getBoat(data);
  return <BoatWrapper location={location} boat={boat} />;
};

