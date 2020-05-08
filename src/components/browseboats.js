import React, { useState } from 'react';
import { Container, Divider } from '@material-ui/core'
import SearchAndFilterBoats from './searchandfilterboats'
import BoatCards from './boatcards'
import { List, ListItem } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

function BrowseBoats() {
    const [boatsPerPage, setBoatsPerPage] = useState(12);
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [where, setWhere] = useState(undefined);

    function updateFilters(filters) {
        console.log(filters);
        const all = [
            { year: { _gte: filters.year.first } },
            { year: { _lte: filters.year.last } },
        ];
        if (filters.ogaNo) {
            all.push({oga_no: { _eq: filters.ogaNo }});
        }
        if (filters['boat-name']) {
            all.push({ _or: [
                { name: {_ilike: `${filters['boat-name']}%`}},
                { previous_names: {_contains: filters['boat-name']}}    
            ]});
        }
        if (filters['designer-name']) {
            all.push({designerByDesigner: { name: { _eq: filters['designer-name'] } }});
        }
        if (filters['builder-name']) {
            all.push({ buildersByBuilder: { name: { _eq: filters['builder-name']}}});
        }
        if (filters['rig-type']) {
            all.push({rigTypeByRigType: { name: { _eq: filters['rig-type']}}});
        }
        if (filters['mainsail-type']) {
            all.push({sail_type: { name: { _eq: filters['mainsail-type']}}});
        }
        if (filters['generic-type']) {
            all.push({genericTypeByGenericType: { name: { _eq: filters['generic-type']}}});
        }
        if (filters['design-class']) {
            all.push({designClassByDesignClass: { name: { _eq: filters['design-class']}}});
        }
        if (filters['construction-material']) {
            all.push({constructionMaterialByConstructionMaterial: { name: { _eq: filters['construction-material'] } }});
        }
        if (!filters['nopics']) {
            all.push({image_key: { _is_null: false }});
        }
        if (filters['sale']) {
            all.push({for_sale_state: {text: {_eq: "for_sale"}}});
        }
        console.log('filters', all);
        setWhere({ _and: all });
    }

    return (
    <MuiThemeProvider>
    <Container>
        <h3>Welcome to the OGA Boat Register</h3>
        <h4>We have hundreds of boats with pictures and many more waiting for pictures and more information.</h4>
        <p>Filter the list using the options below and then click on a boat for all the pictures and information we have for that boat.</p>
        <p>Have a boat and can't find it here. Fill in our <a href="https://form.jotform.com/jfbcable/new-boat">form</a> and we will add it.</p>
        <p>You can also use the form to suggest a boat whether you own it or not.</p>
        <p>You'll can submit pictures, additions and corrections to boats or contact the owner from the boat's detail page.</p>
        <p>Members can use the register to advertise their boat for sale. The first step is to make sure the boat is on the register.</p>
        <SearchAndFilterBoats 
            onPageSizeChange={(_,a) => a && setBoatsPerPage(parseInt(a.name))}
            onSortFieldChange={(_,a) => a && setSortField(a.name)}
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
        <p>Other great places to look for boats are:</p>
        <List>
            <ListItem><a href="https://www.nationalhistoricships.org.uk">National Historic Ships</a></ListItem>
            <ListItem><a href="https://nmmc.co.uk/explore/databases/">NMM Cornwall</a> maintain a number of interesting databases including small boats, yacht designs</ListItem>
        </List>     
    </Container>
    </MuiThemeProvider>
    );
}

export default BrowseBoats