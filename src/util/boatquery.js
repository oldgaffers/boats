import gql from 'graphql-tag';

export const query = (id) => gql`{
    boat(where: {oga_no: {_eq: ${id}}}) {
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
}`
