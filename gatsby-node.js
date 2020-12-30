const path = require('path');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const boatTemplate = path.resolve('src/templates/boattemplate.jsx');
  const result = await graphql(`
      query {
        register {
          boat(where: {oga_no: {_lte: 300, _gt: 0}}) {
            oga_no
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

  const promises = [];
  posts.forEach(({ oga_no }, index) => {
    function boatpage(resolve, reject) {

      const bp = () => {
        console.log(oga_no, index);
        const path = `/boat/${oga_no}`;
        createPage({
          path,
          component: boatTemplate,
          context: {
            oga_no,
            pathSlug: path,
            home: '/',
            absolute: 'https://oga.org.uk',
            pickers,
          },
        });
        resolve(true);
        return;
      };
      try {
        setTimeout(bp, 200*index);
      } catch(e) {
        reject(e);
      }
    };
    promises.push(new Promise(boatpage));
  });
  await Promise.all(promises);
};

/* Allows named imports */
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  });
};
