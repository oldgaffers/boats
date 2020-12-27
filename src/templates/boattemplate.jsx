import React from 'react';
import { graphql, Link } from 'gatsby';
import { BoatWrapper, queryString } from '../components/boatwrapper';

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

export const query = graphql(queryString);
