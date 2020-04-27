import React from 'react';
import { Container, Divider } from '@material-ui/core'
import SearchAndFilterBoats from './searchandfilterboats'
import BoatCards from './boatcards'

function BrowseBoats() {
    return (
    <Container>
        <h3>Welcome to the OGA Boat Register</h3>
        <h4>We have hundreds of boats with pictures and many more waiting for pictures and more information.</h4>
        <p>Filter the list using the options below and then click on a boat for all the pictures and data we have for that boat.</p>
        <p>Know something we don't? We'd love to hear from you.</p>
        <SearchAndFilterBoats/>
        <Divider/>
        <BoatCards/>
        <Divider/>     
    </Container>
    );
}

export default BrowseBoats