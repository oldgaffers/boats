import MarkerClusterGroup from 'react-leaflet-cluster'
import * as L from 'leaflet';
import React, { useState, useEffect } from 'react';
import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import { Marker } from 'react-leaflet/Marker';
import { Popup } from 'react-leaflet/Popup';
import { CompactBoatCard } from './boatcard';
import { getScopedData } from './boatregisterposts';
import { Stack } from '@mui/system';
import humanizeDuration from 'humanize-duration';

function gaffer(colour) {
    return L.icon({
        iconUrl: `https://oldgaffers.github.io/boatregister//images/gaffer-${colour}.png`,
        shadowUrl: 'https://oldgaffers.github.io/boatregister//images/shadow-gaffer.png',
        iconSize: [32, 37], // size of the icon
        shadowSize: [51, 37], // size of the shadow
        iconAnchor: [16, 34], // point of the icon which will correspond to marker's location
        shadowAnchor: [16, 34],  // the same for the shadow
        popupAnchor: [16, 18] // point from which the popup should open relative to the iconAnchor
    });
}

const gafferBlue = gaffer('blue');
const gafferOrange = gaffer('orange');

const blackDiamond = L.icon({
    iconUrl: `https://oldgaffers.github.io/boatregister//images/diamond.png`,
    shadowUrl: 'https://oldgaffers.github.io/boatregister//images/shadow-gaffer.png',
    iconSize: [32, 32], // size of the icon
    shadowSize: [51, 37], // size of the shadow
    iconAnchor: [16, 34], // point of the icon which will correspond to marker's location
    shadowAnchor: [16, 34],  // the same for the shadow
    popupAnchor: [16, 18] // point from which the popup should open relative to the iconAnchor
});

const whiteDiamond = L.icon({
    iconUrl: `https://oldgaffers.github.io/boatregister//images/diamond-white.png`,
    shadowUrl: 'https://oldgaffers.github.io/boatregister//images/shadow-gaffer.png',
    iconSize: [32, 32], // size of the icon
    shadowSize: [51, 37], // size of the shadow
    iconAnchor: [16, 34], // point of the icon which will correspond to marker's location
    shadowAnchor: [16, 34],  // the same for the shadow
    popupAnchor: [16, 18] // point from which the popup should open relative to the iconAnchor
});

const gaffling = L.icon({
    iconUrl: `https://oldgaffers.github.io/boatregister//images/gaffling.png`,
    shadowUrl: 'https://oldgaffers.github.io/boatregister//images/shadow-gaffer.png',
    iconSize: [32, 32], // size of the icon
    shadowSize: [51, 37], // size of the shadow
    iconAnchor: [16, 34], // point of the icon which will correspond to marker's location
    shadowAnchor: [16, 34],  // the same for the shadow
    popupAnchor: [16, 18] // point from which the popup should open relative to the iconAnchor
});


const lug = L.icon({
    iconUrl: `https://oldgaffers.github.io/boatregister//images/lug.png`,
    shadowUrl: 'https://oldgaffers.github.io/boatregister//images/shadow-gaffer.png',
    iconSize: [32, 32], // size of the icon
    shadowSize: [51, 37], // size of the shadow
    iconAnchor: [16, 34], // point of the icon which will correspond to marker's location
    shadowAnchor: [16, 34],  // the same for the shadow
    popupAnchor: [16, 18] // point from which the popup should open relative to the iconAnchor
});

const partyPorts = [
    { name: 'Ramsgate', latitude: 51.329838850086986, longitude: 1.421028584328367 },
    { name: 'Cowes', latitude: 50.75920541556864, longitude: -1.2931364360365005 },
    { name: 'Plymouth', latitude: 50.369026121055946, longitude: -4.1322539520425465 },
    { name: 'Neyland', latitude: 51.70795144725004, longitude: -4.941540168179836 },
    { name: 'Dublin', latitude: 53.34362082685624, longitude: -6.217210521334736 },
    { name: 'Oban', latitude: 56.41432278536105, longitude: -5.486013316811266 },
    { name: 'Arbroath', latitude: 56.55285835505399, longitude: -2.5820845535616384 },
    { name: 'Blyth', latitude: 55.126374851993425, longitude: -1.4977966801215457 },
];

const jubilee = [
    { name: 'Jubilee', latitude: 51.99487729364512, longitude: 1.268134496760611 },
];

const smallboatEvents = [
    { name: 'Langstone Harbour', latitude: 50.83104762677879, longitude: -1.0037765769566436 },
    { name: 'Cardiff Bay', latitude: 51.455733170865706, longitude: -3.1699478646494836 },
    { name: 'Ullswater', latitude: 54.59583841513551, longitude: -2.841225370330696 },
];

const gafflingEvents = [
    { name: 'Jubilee', latitude: 51.99487729364512, longitude: 1.7 },
];

const extras = [
    { name: 'Portsoy', latitude: 57.68567483697059, longitude: -2.690178873360523 }
];

function BoatMarker({ boat }) {

    const { latitude, longitude, timestamp, source } = boat.location;
    const age = (new Date()).getTime() - (new Date(timestamp)).getTime()
    const d = humanizeDuration(age, { round: true, largest: 2 });
    const title = `${boat.name} ${d} ago from ${source || 'whatsapp'}`;
    return <Marker
        key={boat.oga_no}
        position={[latitude, longitude]}
        icon={gafferBlue}
        title={title}
        eventHandlers={{
            click: () => {
                console.log('marker clicked')
            },
        }}
    >
        <Popup maxWidth='200'>
            <CompactBoatCard ogaNo={boat.oga_no} />
        </Popup>
    </Marker>;
}

function BoatMarkers({ entries }) {
    // const map = useMap()
    // const oms = new OverlappingMarkerSpiderfier(map);

    const visible = (entries || []).filter((boat) => 
    {
        if (boat.location) {
            const up = new Date(boat.location.timestamp).getTime();
            const n = new Date().getTime();
            const days_old = Math.floor((n - up) / 86400000);
            console.log(days_old);
            if (days_old > 6) {
                return false;
            }
            return boat.visible;
        }
        return false;
    });

    return <MarkerClusterGroup chunkedLoading>
        {visible.map((boat) => <BoatMarker boat={boat} />)}
    </MarkerClusterGroup>;
}

export default function RCBEntryMap() {
    const [data, setData] = useState();
    useEffect(() => {
        const getData = async () => {
            const p = await getScopedData('public', 'location');
            setData(p.data);
        }
        if (!data) {
            getData();
        }
    }, [data]);

    return (
        <Stack>
            <MapContainer style={{ height: '800px' }} center={[55.0, -2.0]} zoom={6} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {extras.map((port, index) => <Marker
                    key={index}
                    position={[port.latitude, port.longitude]}
                    icon={gafferOrange}
                    title={port.name}
                ></Marker>)}

                {gafflingEvents.map((port, index) => <Marker
                    key={index}
                    position={[port.latitude, port.longitude]}
                    icon={gaffling}
                    title={port.name}
                ></Marker>)}

                {smallboatEvents.map((port, index) => <Marker
                    key={index}
                    position={[port.latitude, port.longitude]}
                    icon={lug}
                    title={port.name}
                ></Marker>)}

                {partyPorts.map((port, index) => <Marker
                    key={index}
                    position={[port.latitude, port.longitude]}
                    icon={blackDiamond}
                    title={port.name}
                ></Marker>)}

                {jubilee.map((port, index) => <Marker
                    key={index}
                    position={[port.latitude, port.longitude]}
                    icon={whiteDiamond}
                    title={port.name}
                ></Marker>)}

                <BoatMarkers entries={data?.Items} />

            </MapContainer>
            <a href="https://www.flaticon.com/free-icons/diamond" title="diamond icons">Diamond icons created by prettycons - Flaticon</a>
        </Stack>
    );
}
