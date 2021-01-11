module.exports = {
  pathPrefix: `/boat_register`,
  siteMetadata: {
    title: "OGA Boat Register",
    siteURL: "https://oga.org.uk",
  },
  flags: {
    QUERY_ON_DEMAND: true
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-apollo',
      options: {
        typeName: "Register",
        fieldName: "register",
        url: 'https://api-oga.herokuapp.com/v1/graphql'
      }
    },
    'gatsby-plugin-material-ui'
  ],
};
