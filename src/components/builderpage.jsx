import React, { useEffect, useState } from 'react';
import { getFilterable, getPlaces, getScopedData } from '../util/api';
import { FleetDisplay } from './fleetview';
import Contact from './contact';
import { siLK } from '@mui/material/locale';

function yards(place) {
    if (!place || !place.yards) {
        return [];
    }
    if (Array.isArray(place.yards)) {
        return place.yards;
    }
    return Object.values(place.yards);
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

export function BuilderSummary({ name, place }) {  
        const [summary, setSummary] = useState();
        useEffect(() => {
            const getData = async () => {
                const data = await getScopedData('public', 'builder', { builder: name, place: place?.place });
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
    console.log('H', headings, 'E', extra);
    return <div>
        <h3>Origins</h3>
        {JSON.stringify(summary.origins)}
        <h3>Early Work</h3>
        {JSON.stringify(summary.early_work)}
        <h3>Notable Vessels</h3>
        <table>
            <tr><th>Name</th><th>Type</th><th>Period</th><th>Associated With</th></tr>
            {summary.notable_vessels.map((v) => (
                <tr><td>{v.name}</td><td>{v.type}</td><td>{v.period}</td><td>{v.associated_with}</td></tr>
            ))}
        </table>
        {JSON.stringify(summary.notable_vessels)}
        <h3>Legacy</h3>
        {JSON.stringify(summary.legacy)}
        {extra.map((k) => <div key={k}><h3>{toTitleCase(k.replaceAll('_', ' '))}</h3>{JSON.stringify(summary[k])}</div>)}
        <h3>Sources</h3>
        <ul>
            {summary.sources.map((s) => (<li key={s}><a href={s}>{s}</a></li>))}
        </ul>
        {JSON.stringify(summary.sources)}
        <div>
        The above is an AI generated summary of {name}. It could be a load of rubbish and should be checked against other sources.
        Please contact the Boat Register editors if you find any mistakes.
        </div>
    </div>;
}

export default function BuilderPage({ name }) {
        const [place, setPlace] = useState();
        const [filterable, setFilterable] = useState();
       useEffect(() => {
            const getData = async () => {
                const places = Object.values(await getPlaces());
                const filtered = places.filter((p) => yards(p).filter((y) => y.name === name).length > 0);
                setPlace(filtered[0]);
            }
            if (!place) {
                getData();
            }
        }, [place, name]);
        useEffect(() => {
            const getData = async () => { 
                const f = await getFilterable();
                setFilterable(f);
            }
            if (!filterable) {
                getData();
            }
        }, [filterable]);
    const nobuilder = filterable?.filter((b) => (b.place_built === place?.place) && (b.builder || []).length === 0);
    console.log(nobuilder);
    return <div>
        <h3>Page for Boat Builder {name}</h3>
        <BuilderSummary name={name} place={place} />
        <p></p>
        Boats built by {name} according to OGA Boat Register data:
        <FleetDisplay filters={{ builder: name }} defaultExpanded={true} />
        Other builders referenced in the OGA Boat Register in {place?.place}:
        <ul>
            {yards(place).filter((y) => y.name !== name).map((y) => <li key={y.name}><a href={`/boat_register/builder/?name=${y.name}`}>{y.name}</a> ({y.count})</li>)}
        </ul>
        If see an error or if you know two or more entries refer to the same builder, please let us know and we will fix / merge them.
        <p></p>
        <Contact text={name}/>
    </div>;
}