import React from 'react';
import 'dayjs/locale/en-gb';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41], // size of the icon
    shadowSize: [41, 41], // size of the shadow
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    shadowAnchor: [16, 34],  // the same for the shadow
    popupAnchor: [1, -34] // point from which the popup should open relative to the iconAnchor
});

function MapComponent({ data }) {
    const bounds = L.latLngBounds(data[0], data[0]);
    data.slice(1).forEach((d) => bounds.extend(d));

    if (bounds.getNorthEast().distanceTo(bounds.getSouthWest()) < 10000) {
        const MINXY = 0.5;
        const c = bounds.getCenter();
        bounds.extend({ lat: c.lat + MINXY, lng: c.lng + MINXY });
        bounds.extend({ lat: c.lat - MINXY, lng: c.lng - MINXY });
    }

    const map = useMapEvents({});

    map?.fitBounds(bounds);

    return (<>{data?.map((m) => <Marker key={JSON.stringify(m)} position={m} icon={defaultIcon}>
    </Marker>)}</>);
}

export default function VoyageMap({ places }) {
    return (
        <MapContainer
            style={{ height: 300 }}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapComponent data={places} />
        </MapContainer>
    );
}