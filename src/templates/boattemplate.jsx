import React from 'react';
import { graphql, Link } from 'gatsby';
import { BoatWrapper } from '../components/boatwrapper';

const BoatTemplate = ({ data, pageContext }) => {
  const pickers = {
    design_class: data.register.design_class.map(v => v.name),
    generic_type: data.register.generic_type.map(v => v.name),
    sail_type: data.register.sail_type.map(v => v.name),
    rig_type: data.register.rig_type.map(v => v.name),
    designer: data.register.designer.map(v => v.name),
    construction_method: data.register.construction_method.map(v => v.name),
    construction_material: data.register.construction_material.map(v => v.name),
    spar_material: data.register.spar_material.map(v => v.name),
    builder: data.register.builder.map(v => v.name),
    hull_form: data.register.hull_form.map(v => v.name)
  };

  const { home, absolute } = pageContext;
  return (<BoatWrapper
    boat={data.register.boat[0]}
    pickers={pickers}
    link={Link}
    home={home}
    absolute={absolute}
    />);
};

export default BoatTemplate;

export const query = graphql`
query BoatQuery ($oga_no: Int!){
  __typename
  register {
    design_class { name }
    generic_type { name }
    sail_type { name }
    rig_type { name }
    designer { name }
    construction_method { name }
    construction_material { name }
    spar_material { name }
    builder { name }
    hull_form { name }
    boat(where: {oga_no: {_eq: $oga_no}}){
	    id
	    name
	    previous_names
	    year
	    year_is_approximate
	    public
	    place_built
	    home_port
	    home_country
	    ssr
	    sail_number
	    nhsr
	    nsbr
	    oga_no
	    fishing_number
	    callsign
	    mssi
	    full_description
	    image_key
	    uk_part1
	    spar_material
	    constructionMaterialByConstructionMaterial { name }
	    constructionMethodByConstructionMethod { name }
	    construction_details
	    designClassByDesignClass { name }
	    designerByDesigner { name }
	    draft
	    generic_type
	    handicap_data
	    hull_form
	    keel_laid
	    launched
	    length_on_deck
	    mainsail_type
	    rigTypeByRigType { name }
	    sail_type { name }
	    short_description
	    updated_at
	    website
	    genericTypeByGenericType { name }
	    builderByBuilder { name notes }
	    beam
	    air_draft
	    reference
	    for_sale_state { text }
	    for_sales(limit: 1, order_by: {updated_at: desc}) {
	      asking_price
	      flexibility
	      offered
	      price_flexibility { text }
	      reduced
	      sales_text
	      sold
	      summary
	      updated_at
	    }
	    engine_installations {
	      engine
	      installed
	      removed
	    }
    }
  }
}
`;
