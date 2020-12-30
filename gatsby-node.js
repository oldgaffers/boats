const path = require('path');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const boatTemplate = path.resolve('src/templates/boattemplate.jsx');
    
    resolve(
      graphql(
        `
          query {
            register {
              boat(limit: 6) {
                oga_no
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          return reject(result.errors);
        }

        const posts = result.data.register.boat;
        
        // create posts
        posts.forEach((boat, index) => {
          console.log(JSON.stringify(boat));
          const { oga_no } = boat;
          const path = `/boat/${oga_no}`;
          createPage({
            path,
            component: boatTemplate,
            context: {
              oga_no,
              pathSlug: path,
              home: '/',
              absolute: 'https://oga.org.uk',
            },
          });
        });
      })
    );
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
