import React, { useEffect, useState } from 'react';
import { getFilterable, getPlaces, getScopedData } from '../util/api';
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

export function BuilderSummary({ name }) {  
        const [summary, setSummary] = useState();
        useEffect(() => {
            const getData = async () => {
                const data = await getScopedData('public', 'builder', { builder: name });
                setSummary(data);
            }
            if (!summary) {
                getData();
            }
        }, [summary, name]);

    if (!summary) {
        return <div>Loading...</div>;
    }
    if (typeof summary === 'string') {
        return <div>We don't have much information on this builder</div>;
    }
    return <div>
        {JSON.stringify(summary)}
        The above is an AI generated summary of {name}. It may contain errors and should be checked against other sources.
        Please contact the Boat Register editors if you find any mistakes.
        <p></p>
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
        <BuilderSummary name={name} />
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