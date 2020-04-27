import React, { useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import RigAndSails from './rigandsails';
import ImageCarousel from './imagecarousel';
// import TextList from './textlist';

const boatQuery = (id) => gql`{
    boat(id:${id}) {
        name prev_name
        year approximate_year_of_build
        place_built home_country home_port
        sail_no ssr_no nhsr_no fishing_no call_sign
        other_registries nsbr_no off_reg_no port_reg
        short_desc full_desc
        for_sale sale_text price
        images{
            uri
            copyright
            height width title alt
        }
        class{
            name
            rigType
            mainsailType
            hullType
            genericType
        }
        builder{name}
        construction_material
        construction_method
        beam
        draft
        length_on_waterline
        length_overall
        propulsion{
            propellor_type
            propellor_position
            propellor_blades
            engine_fuel
            engine_position
            engine_date
            engine_make
            engine_power
            hp
            previous_engine
        }
    }
  }`;

const registration = {
    prev_name: { label: 'Previous name/s' },
    place_built: { label: 'Place built' },
    year: { label: 'Year of Build' },
    approximate_year_of_build: { label: 'Approximate Year of Build' },
    sail_no: { label: 'Sail No.' },
    home_country: { label: 'Home Country' },
    ssr_no: { label: 'Small Ships Registry no. (SSR)' },
    nhsr_no: { label: 'National Register of Historic Vessels no. (NRHV)' },
    fishing_no: { label: 'Fishing No.' },
    call_sign: { label: 'Call Sign' },
    other_registries: { label: 'Other Registrations' },
    nsbr_no: { label: 'National Small Boat Register' },
    off_reg_no: { label: 'Official Registration' },
    port_reg: { label: 'Port of Registry' }
};

const construction = {
    construction_method: { label: 'Construction method' },
    construction_material: { label: 'Construction material' },
    class: {
        hullType: { label: 'Hull Type' },
        genericType: { label: 'Generic Type ' },
    },
    builder: { name: { label: 'Builder' } }
};

const hull = {
    length_overall: { label: 'Length on deck (LOD):', unit: 'ft' },
    length_on_waterline: { label: 'Length on waterline (LWL):', unit: 'ft' },
    beam: { label: 'Beam', unit: 'ft' },
    draft: { label: 'Draft', unit: 'ft' }
};

const engine = {
    engine_make: { label: 'Engine make:' },
    engine_power: { label: 'Engine power:' },
    engine_date: { label: 'Engine date:' },
    engine_fuel: { label: 'Engine fuel:' },
    previous_engine: { label: 'Previous engine(s):' },
    propellor_blades: { label: 'Propeller blades:' },
    propellor_type: { label: 'Propeller type:' },
    propellor_position: { label: 'Propeller position:' }
};

export default function Boat({ id }) {
    
    const { loading, error, data } = useQuery(boatQuery(id));

    useEffect(() => {
        if (data) {
            document.title = data.boat.name;
        }
    });

    const rigItems = RigAndSails({ id }); // uses hooks so must be unconditional

    console.log(registration, construction, hull, engine, rigItems);

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: (Boat)</p>;
    const boat = data.boat;

    /*
    const panes = [
        { menuItem: 'Registration and location', render: () => <Tab.Pane><List><ListItems labels={registration} boat={boat} /></List></Tab.Pane> },
        { menuItem: 'Construction', render: () => <Tab.Pane><List><ListItems labels={construction} boat={boat} /></List></Tab.Pane> },
        { menuItem: 'Hull', render: () => <Tab.Pane><List><ListItems labels={hull} boat={boat} /></List></Tab.Pane> },
    ];
    
    if (rigItems.length > 0) {
        panes.push({ menuItem: 'Rig and Sails', render: () => <Tab.Pane><List>{rigItems}</List></Tab.Pane> });
    }
    const engineItems = ListItems({ labels: engine, boat: boat.propulsion });
    if (engineItems.length > 0) {
        panes.push({ menuItem: 'Engine', render: () => <Tab.Pane><List>{engineItems}</List></Tab.Pane> });
    }
    

    if (boat.full_desc) {
        panes.unshift(
            { menuItem: 'Full Description', render: () => <Tab.Pane dangerouslySetInnerHTML={{ __html: boat.full_desc }} /> },
        );
    }
    

    if (boat.for_sale) {
        let text = boat.sale_text;
        if (boat.price) {
            text += "<b>Price: </b>" + boat.price;
        }
        panes.unshift({
            menuItem: 'For Sale', render: () => <Tab.Pane dangerouslySetInnerHTML={{ __html: text }} />
        });
    }
    */

    return (
    <Grid columns={2} divided>
        <Grid.Row>
            <Grid.Column width={10}>
                <Typography variant="h1">{boat.name}</Typography>
            </Grid.Column>
            <Grid.Column width={1}>
                <Typography variant="h1">{boat.year}</Typography>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column width={13}>
                <ImageCarousel images={boat.images} />
            </Grid.Column>
            <Grid.Column width={3}>
                <Typography variant="h2">Details</Typography>
                {
                    /*
                <List>
                    <List.Item header='Boat OGA no:' content={id} />
                    <List.Item header='Mainsail type:' content={boat.class.mainsailType} />
                    <List.Item header='Rig type:' content={boat.class.rigType} />
                    <List.Item header='Home port or other location:' content={boat.home_port} />
                    <ListItem><div dangerouslySetInnerHTML={{ __html: boat.short_desc }}></div></ListItem>
                </List>
                */
                }
            </Grid.Column>
        </Grid.Row>
        <Grid.Row width={16}>
           { /*<Tab panes={panes} />*/}
        </Grid.Row>
    </Grid>
    );
};