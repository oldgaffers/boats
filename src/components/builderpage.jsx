import React, { useEffect, useState } from 'react';
import { FormControl, Radio, RadioGroup } from "@mui/material";
import { getPlaces, getScopedData } from '../util/api';
import { FleetDisplay } from './fleetview';
import Contact from './contact';
import MergeButton from './mergebutton';
import { useAuth0 } from '@auth0/auth0-react';

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

export function VesselTable({ heading, vessels }) {
    const title = toTitleCase(heading.replaceAll('_', ' '));
    if (Array.isArray(vessels)) {
        if (vessels.length === 0)
            return '';
        return <>
            <h4>{title}</h4>
            <table>
                <thead>
                    <tr><th>Name</th><th>Type</th><th>Period</th><th>Associated With</th><th>Notes</th></tr>
                </thead>
                <tbody>
                    {vessels.map((v, index) => (
                        <tr key={index}><td>{v.name}</td><td>{v.type}</td><td>{v.period}</td><td>{v.associated_with}</td><td>{v.notes || ''}</td></tr>
                    ))}
                </tbody>
            </table>
        </>;
    }
    return <div><h4>{title}</h4><div>{vessels}</div></div>
}

export function NotableVessels({ notable_vessels }) {
    if (Array.isArray(notable_vessels) && notable_vessels.length > 0) {
        return <VesselTable heading='Notable Vessels' vessels={notable_vessels} />
    }
    if (!notable_vessels) {
        return '';
    }
    if (typeof notable_vessels === 'string') {
        return notable_vessels;
    }
    const categories = Object.keys(notable_vessels);
    return <>{categories.map((c) => <VesselTable key={c} heading={c} vessels={notable_vessels[c]} />)}</>;
}

export function BuilderSummary({ name, place }) {
    const [summary, setSummary] = useState();
    useEffect(() => {
        const getData = async () => {
            const data = await getScopedData('public', 'builder', { builder: name, place: place });
            setSummary(data);
        }
        if (!summary) {
            getData();
        }
    }, [summary, name, place]);

    if (!summary) {
        return <div>Loading...</div>;
    }
    if (typeof summary === 'string') {
        return <div>We don't have much information on this builder</div>;
    }
    const headings = Object.keys(summary);
    if (!headings.includes('origins')) {
        return <div>We don't have much information on this builder</div>;
    }
    const extra = headings.filter((h) => !['notable_vessels', 'origins', 'legacy', 'sources', 'early_work'].includes(h));
    return <div>
        <h3>AI Generated Summary</h3>
        <h4>Origins</h4>
        {summary.origins}
        <h4>Early Work</h4>
        {summary.early_work}
        <NotableVessels notable_vessels={summary.notable_vessels} />
        <h4>Legacy</h4>
        {summary.legacy}
        {extra.map((k) => <div key={k}><h4>{toTitleCase(k.replaceAll('_', ' '))}</h4>{JSON.stringify(summary[k])}</div>)}
        <h4>Sources</h4>
        <ul>
            {(summary.sources || []).map((s) => (<li key={s}><a href={s}>{s}</a></li>))}
        </ul>
        <div>
            The above is an AI generated summary of {name}. It could be a load of rubbish and should be checked against other sources.
            Please contact the Boat Register editors if you find any mistakes.
        </div>
    </div>;
}

export function AllBuilders({ email, place, yards, yard }) {
    const [merge, setMerge] = useState([]);
    const [keep, setKeep] = useState();

    const handleKeep = (ev) => {
        setKeep(ev.target.value);
    }
    const handleMerge = (yard, checked) => {
        const n = []
        if (checked) {
            if (!merge.includes(yard)) n.push(yard);
            merge.forEach(v => n.push(v));
        } else {
            merge.filter((v) => v !== yard).forEach(v => n.push(v));
        }
        setMerge(n);
    }
    if (yards.length < 2) {
        return '';
    }
    return <>
        <h3>All builders referenced in the OGA Boat Register in {place}</h3>
        <FormControl>
            <RadioGroup defaultValue={yard} onChange={handleKeep}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr' }}>
                    <Box></Box><Box>Merge</Box><Box>Keep</Box>
                    {yards.map(({ name, count }) =>
                        <>
                            {
                                (name === yard)
                                    ?
                                    <span>{name} {count}</span>
                                    :
                                    <a href={`/boat_register/builder/?name=${name}&place=${place}`}>{name} {count}</a>
                            }
                            <Checkbox value={name} onChange={(ev) => handleMerge(name, ev.target.checked)} />
                            <Radio value={name} />
                        </>
                    )}
                </Box>
            </RadioGroup>
            <MergeButton update={{ email, keep, merge, field: 'builder', id: `${place}_${new Date().toISOString()}` }} />
        </FormControl>
    </>;
}

export function OtherBuilders({ place, yards, yard }) {
    if (yards.length === 0) {
        return '';
    }
    return <>
        <h3>Other builders referenced in the OGA Boat Register in {place}</h3>
        <ul>
            {yards.filter((y) => y.name !== yard).map((y) => <li key={y.name}><a href={`/boat_register/builder/?name=${y.name}&place=${place}`}>{y.name}</a> ({y.count})</li>)}
        </ul>
    </>;
}

export function NoBuilder({ place, boats }) {
    if (Array.isArray(boats) && boats.length > 0) {
        return <>
            <h3>Boats built in {place} with no builder recorded</h3>
            <FleetDisplay filters={{ oga_nos: boats }} defaultExpanded={true} />
        </>;
    }
    return '';
}

export default function BuilderPage({ name, place }) {
    const [location, setLocation] = useState();
    const { user, isAuthenticated } = useAuth0();
    useEffect(() => {
        const getData = async () => {
            const places = await getPlaces();
            if (place) {
                setLocation(places[place]);
            } else {
                const p = Object.values(places).find((p) => p.yards[name]);
                if (p) {
                    setLocation(p);
                } else {
                    setLocation({ place: 'unspecified place', yards: [] });
                }
            }
        }
        if (name && !location) {
            getData();
        }
    }, [location, name, place]);
    if (!name) {
        return "This page expects the name of a boat builder as the value of a name query parameter."
    }
    if (!location) {
        return 'Loading';
    }
    const yards = Object.values(location.yards);
    return <div>
        <h2>Page for Boat Builder {name}</h2>
        <BuilderSummary name={name} place={place} />
        <p></p>
        <h3>Boats built by {name} according to OGA Boat Register data</h3>
        <FleetDisplay filters={{ builder: name }} defaultExpanded={true} />
        {
            (isAuthenticated)
            ?
                <AllBuilders email={user?.email} place={location.place} yard={name} yards={yards} />
            :      
                <OtherBuilders place={location.place} yard={name} yards={yards} />
        }
        <NoBuilder place={location.place} boats={location.no_yard} />
        If see an error or if you know two or more entries refer to the same builder, please let us know and we will fix / merge them.
        <p></p>
        <Contact text={name} />
    </div>;
}