import React, { useEffect, useState } from 'react';
import { getPlaces, getScopedData } from '../util/api';
import { FleetDisplay } from './fleetview';
import Contact from './contact';

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

export function NotableVessels({ notable_vessels }) {
    if (Array.isArray(notable_vessels) && notable_vessels.length > 0) {
        return <>
            <h4>Notable Vessels</h4>
            <table>
                <tr><th>Name</th><th>Type</th><th>Period</th><th>Associated With</th><th>Notes</th></tr>
                {notable_vessels.map((v) => (
                    <tr><td>{v.name}</td><td>{v.type}</td><td>{v.period}</td><td>{v.associated_with}</td><td>{v.notes || ''}</td></tr>
                ))}
            </table>
        </>;
    }
    if (!notable_vessels) {
        return '';
    }
    return notable_vessels;
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

export default function BuilderPage({ name, nb }) {
    const [place, setPlace] = useState();
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
    const nobuilder = (nb || '').split(',').map((o) => Number(o));
    console.log('NB', nobuilder);
    return <div>
        <h2>Page for Boat Builder {name}</h2>
        <BuilderSummary name={name} place={place} />
        <p></p>
        <h3>Boats built by {name} according to OGA Boat Register data</h3>
        <FleetDisplay filters={{ builder: name }} defaultExpanded={true} />
        <h3>Other builders referenced in the OGA Boat Register in {place?.place}</h3>
        <ul>
            {yards(place).filter((y) => y.name !== name).map((y) => <li key={y.name}><a href={`/boat_register/builder/?name=${y.name}`}>{y.name}</a> ({y.count})</li>)}
        </ul>
        <h3>Boats built in {place?.place} with no builder recorded</h3>
        <FleetDisplay filters={{ oga_nos: nobuilder }} defaultExpanded={true} />
        If see an error or if you know two or more entries refer to the same builder, please let us know and we will fix / merge them.
        <p></p>
        <Contact text={name} />
    </div>;
}