import React, { useState } from 'react';
import { Container, Divider } from '@material-ui/core'
import SearchAndFilterBoats from './searchandfilterboats'
import BoatCards from './boatcards'

function BrowseBoats() {
    const [boatsPerPage, setBoatsPerPage] = useState(12);
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [where, setWhere] = useState(undefined);

    function updateFilters(event, option) {
        let field; let value;
        if (option) {
            if (option.name) {
                if(option.__typename) {
                    field = option.__typename;
                    value = option.name;
                    // console.log('updateFilters', option.__typename, option.name);
                } else {
                    console.log('updateFilters', '?', value.name);
                }
            } else {
                // console.log('updateFilters', event, option);
                field = event;
                value = option;
        }    
        } else {
            if(event) {
                if (event.target) {
                    // console.log('updateFilters', event.target.id, event.target.value);
                    field = event.target.id;
                    value = event.target.value;
                } else {
                    // console.log('updateFilters', event);
                    field = event;
                    value = false;
                    }
            } else {
                // console.log('updateFilters');
            }
        }
        console.log(updateFilters, field, value);
    }

    return (
    <Container>
        <h3>Welcome to the OGA Boat Register</h3>
        <h4>We have hundreds of boats with pictures and many more waiting for pictures and more information.</h4>
        <p>Filter the list using the options below and then click on a boat for all the pictures and data we have for that boat.</p>
        <p>Know something we don't? We'd love to hear from you.</p>
        <SearchAndFilterBoats 
            onPageSizeChange={(_,{name}) => setBoatsPerPage(parseInt(name))}
            onSortFieldChange={(_,{name}) => setSortField(name)}
            onSortDirectionChange={event => setSortDirection(event.target.checked?'desc':'asc')}
            onFilterChange={updateFilters}
        />
        <Divider/>
        <BoatCards
            boatsPerPage={boatsPerPage}
            sortField={sortField}
            sortDirection={sortDirection}
            where={where}
        />
        <Divider/>     
    </Container>
    );
}

export default BrowseBoats