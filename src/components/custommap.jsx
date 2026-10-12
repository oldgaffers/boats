import React, { useState, useEffect } from 'react';
import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import { Marker } from 'react-leaflet/Marker';
import Backdrop from '@mui/material/Backdrop';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { getScopedData } from '../util/api';
import BoatMarkers from './boatmarkers';
import PlaceMarkers from './placemarkers';
import { customIcons } from '../util/mapicons';

function SimpleBackdrop({ open }) {
    return (
        <div>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default function CustomMap(props) {
    const [data, setData] = useState();
    useEffect(() => {
        const getData = async () => {
            const p = await getScopedData(props.scope, props.table);
            if (p.Items) {
                setData(p.Items);
            } else {
                setData([]);
            }
        }
        if (!data) {
            getData();
        }
    }, [data, props.scope, props.table]);
    const boats = (data || []).filter((b) => b.ogaNo);
    const places = (data || []).filter((b) => b.place);
    // But there's a super simple fix. Just add .leaflet-container {z-index:0}
    return (
        <Stack>
            <Box height={800} zIndex={0} >
                <MapContainer style={{ height: '800px' }} center={[55.0, -2.0]} zoom={6} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {(window.markers || []).map((port, index) => <Marker
                        key={index}
                        position={[port.latitude, port.longitude]}
                        icon={customIcons[port.icon]}
                        title={port.name}
                    ></Marker>)}

                    <BoatMarkers entries={boats} />
                    <PlaceMarkers entries={places} />

                </MapContainer>
            </Box>
            <SimpleBackdrop open={!data} />
        </Stack>
    );
}
