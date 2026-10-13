import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { customIcons } from "../util/mapicons";

function yards(place) {
    const yards = (Array.isArray(place.yards) ? place.yards : Object.values(place.yards)) || [];
    if (yards.length > 0) {
        return yards;
    }
    if (place.no_yard?.length > 0) {
        return [{ name: 'Yard Unknown', count: place.no_yard.length }];
    }
    return [];
}

function YardInfo({ place }) {
    const y = yards(place);
    y.sort((a, b) => a.count - b.count);
    return <div>
        <h3>{place.place}</h3>
        <p>Boats built here: {place.count}</p>
        <h4>Builders</h4>
        {y.map(((y, i) => <div key={i}>
            <a href={`/boat_register/builder/?name=${y.name}&place=${place.place}`}>{y.name}</a>
        </div>))}
    </div>;
}

export default function YardMarkers({ entries }) {
    return <MarkerClusterGroup chunkedLoading>
        {entries.map((place, index) => <Marker
            key={index}
            position={[place.latitude, place.longitude]}
            icon={customIcons[place.icon || 'yard']}
            title={place.name}
        >
            <Popup maxWidth='200'>
                <YardInfo place={place} />
            </Popup>
        </Marker>)}
    </MarkerClusterGroup>;
}