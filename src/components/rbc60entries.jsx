import * as L from 'leaflet';
import React, { useContext, useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import CircularProgress from "@mui/material/CircularProgress";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Tab, Tabs, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import { Marker } from 'react-leaflet/Marker';
import { Popup } from 'react-leaflet/Popup';
import { TokenContext } from './TokenProvider';
import { PublicFleetView } from './fleetview';
import { getScopedData } from './boatregisterposts';
import EntryTable from './rbc60entrytable';
import FleetIcon from "./fleeticon";
import RoleRestricted from './rolerestrictedcomponent';
import { CompactBoatCard } from './boatcard';

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

// <a href="https://www.flaticon.com/free-icons/diamond" title="diamond icons">Diamond icons created by prettycons - Flaticon</a>

const gafferBlue = gaffer('blue');
const gafferOrange = gaffer('orange');

const diamond = L.icon({
    iconUrl: `https://oldgaffers.github.io/boatregister//images/diamond.png`,
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
    { name: 'Cowes', latitude: 50.74840882125257, longitude: -1.2915786665067661 },
    { name: 'Plymouth', latitude: 50.369026121055946, longitude: -4.1322539520425465 },
    { name: 'Neyland', latitude: 51.70795144725004, longitude: -4.941540168179836 },
    { name: 'Dublin', latitude: 53.34362082685624, longitude: -6.217210521334736 },
    { name: 'Oban', latitude: 56.41432278536105, longitude:  -5.486013316811266 },
    { name: 'Arbroath', latitude: 56.55285835505399, longitude: -2.5820845535616384 },
    { name: 'Blyth', latitude: 55.126374851993425, longitude: -1.4977966801215457 },
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
    { name: 'Portsoy', latitude: 57.68567483697059, longitude: -2.690178873360523}
];

function RCBEntryTable() {
    const name = 'RBC 60';
    const accessToken = useContext(TokenContext);
    const { user } = useAuth0();
    const [data, setData] = useState();

    useEffect(() => {
        const getData = async () => {
            const p = await getScopedData('member', 'entries', { topic: name }, accessToken);
            setData(p.data);
        }
        if (accessToken) {
            getData();
        }
    }, [accessToken, user]);

    if (!accessToken) {
        return '';
    }
    if (!data) {
        return <CircularProgress />;
    }

    const entries = (data?.Items) || [];

    return (
        <RoleRestricted role='member'>
            <Accordion>
                <AccordionSummary
                    expandIcon={
                        <Tooltip placement='left' title='click to show or hide the text'>
                            <ExpandMoreIcon />
                        </Tooltip>
                    }
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <FleetIcon /><Typography>Table of Entries</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <EntryTable rows={entries} />
                </AccordionDetails>
            </Accordion>
        </RoleRestricted>);
}

export function RCBEntryMap() {
    const name = 'RBC 60';
    const accessToken = useContext(TokenContext);
    const { user } = useAuth0();
    const [data, setData] = useState();
    useEffect(() => {
        const getData = async () => {
            const p = await getScopedData('member', 'entries', { topic: name }, accessToken);
            setData(p.data);
        }
        if (accessToken) {
            getData();
        }
    }, [accessToken, user, data]);
    const entries = (data?.Items) || [];
    return (
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
                        icon={diamond}
                        title={port.name}
                        ></Marker>)}

            {entries.map((entry, index) => {
                if (entry.data.boat.location) {
                    const { boat } = entry.data;
                    const { latitude, longitude } = boat.location;
                    return <Marker
                        key={index}
                        position={[latitude, longitude]}
                        icon={gafferBlue}
                        title={boat.name}
                        >
                        <Popup>
                            <CompactBoatCard ogaNo={boat.oga_no} />
                        </Popup>
                    </Marker>;
                } else {
                    return '';
                }
            })}
        </MapContainer>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default function RBC60Entryies() {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Typography>
                On this page everyone can see the list of boats
                going all the way round on the OGA 60 Round Britain Cruise.
            </Typography>
            <Typography>
                Logged-in members can see a table of all the boats registered for RBC60 events
                and a map of the cruise.
            </Typography>
            <Typography>When the cruise starts,
                the positions of each boat will be updated by the skippers.
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="round britain features">
                    <Tab label="Circumnavigators" {...a11yProps(0)} />
                    <Tab label="Map" {...a11yProps(1)} />
                    <Tab label="Entries" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <PublicFleetView filter={{ name: 'RBC 60' }} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <RoleRestricted role='member'>
                    <RCBEntryMap />
                </RoleRestricted>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <RCBEntryTable />
            </TabPanel>
        </>
    );
}
