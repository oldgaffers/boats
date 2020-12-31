const path = require('path');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const boatTemplate = path.resolve('src/templates/boattemplate.jsx');
  const result = await graphql(`
      query {
        register {
          boat(where: {oga_no: {_lte: 10000, _gt: 0}}) {
            oga_no
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
    `);
  const posts = result.data.register.boat; 
  const lists = await graphql(`
  query {
    register {
      boat{name previous_names}
      designer(order_by: {name: asc}){name}
      builder(order_by: {name: asc}){name}
      rig_type(order_by: {name: asc}){name}
      sail_type(order_by: {name: asc}){name}
      design_class(order_by: {name: asc}){name}
      generic_type(order_by: {name: asc}){name}
      construction_material(order_by: {name: asc}){name}
      construction_method(order_by: {name: asc}){name}
      hull_form(order_by: {name: asc}){ name }
      spar_material(order_by: {name: asc}){ name }
    }
  }
  `);
  const r = lists.data.register; 
  const pickers = {
    design_class: r.design_class.map(v => v.name),
    generic_type: r.generic_type.map(v => v.name),
    sail_type: r.sail_type.map(v => v.name),
    rig_type: r.rig_type.map(v => v.name),
    designer: r.designer.map(v => v.name),
    construction_method: r.construction_method.map(v => v.name),
    construction_material: r.construction_material.map(v => v.name),
    spar_material: r.spar_material.map(v => v.name),
    builder: r.builder.map(v => v.name),
    hull_form: r.hull_form.map(v => v.name)
  };

  posts.forEach((boat) => {
    const { oga_no } = boat;
    const path = `/boat/${oga_no}`;
    createPage({
      path,
      component: boatTemplate,
      context: {
        boat,
        pathSlug: path,
        home: '/',
        absolute: 'https://oga.org.uk',
        pickers,
      },
    });
  });
 };

/* Allows named imports */
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  });
};
