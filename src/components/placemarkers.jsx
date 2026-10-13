import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { customIcons } from "../util/mapicons";

const places = [
      { name: 'Jubilee', latitude: 51.9948773, longitude: 1.2681345, icon: 'whiteDiamond' },
      { name: 'Jubilee', latitude: 51.9948773, longitude: 1.7, icon: 'gaffling' },
      { name: 'Ramsgate', latitude: 51.32983885, longitude: 1.421, icon: 'blackDiamond' },
      { name: 'Cowes', latitude: 50.7592, longitude: -1.293136436, icon: 'blackDiamond' },
      { name: 'Plymouth', latitude: 50.369, longitude: -4.132253952, icon: 'blackDiamond' },
      { name: 'Neyland', latitude: 51.708, longitude: -4.94154, icon: 'blackDiamond' },
      { name: 'Dublin', latitude: 53.34362, longitude: -6.21721, icon: 'blackDiamond' },
      { name: 'Oban', latitude: 56.41432278536105, longitude: -5.486, icon: 'blackDiamond' },
      { name: 'Arbroath', latitude: 56.552858355054, longitude: -2.582, icon: 'blackDiamond' },
      { name: 'Blyth', latitude: 55.126374852, longitude: -1.4978, icon: 'blackDiamond' },
      { name: 'Langstone Harbour', latitude: 50.831, longitude: -1.0, icon: 'lug' },
      { name: 'Cardiff Bay', latitude: 51.45573317, longitude: -3.17, icon: 'lug' },
      { name: 'Ullswater', latitude: 54.6, longitude: -2.84122537, icon: 'lug' },
      { name: 'Portsoy', latitude: 57.68567483697059, longitude: -2.69, icon: 'gafferOrange' }
    ];

export default function PlaceMarkers({ entries }) {
    return <MarkerClusterGroup chunkedLoading>
        {places.map((place, index) => <Marker
            key={index}
            position={[place.latitude, place.longitude]}
            icon={customIcons[place.icon || 'yard']}
            title={place.name}
        >
        </Marker>)}
    </MarkerClusterGroup>;
}
