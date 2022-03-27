-- after this, the console needs to be used to add the relationships
-- builderByBuilder boatwithrank . builder  → builder . id
-- designerByDesigner boatwithrank . designer  → designer . id
-- for_sale_state boatwithrank . selling_status  → for_sale_state . text
CREATE
OR REPLACE VIEW "public"."boatwithrank" AS
SELECT
  b.name,
  b.mainsail_type,
  b.rig_type,
  b.short_description,
  b.full_description,
  b.website,
  b.hull_form,
  b.year,
  b.year_is_approximate,
  b.draft,
  b.beam,
  b.length_on_deck,
  b.construction_method,
  b.construction_material,
  b.air_draft,
  b.home_port,
  b.oga_no,
  b.mssi,
  b.uk_part1,
  b.ssr,
  b.nsbr,
  b.nhsr,
  b.callsign,
  b.sail_number,
  b.fishing_number,
  b.keel_laid,
  b.launched,
  b.place_built,
  b.builder,
  b.designer,
  b.home_country,
  b.id,
  b.created_at,
  b.updated_at,
  b.generic_type,
  b.design_class,
  b.image_key,
  b.construction_details,
  b.previous_names,
  b.handicap_data,
  b.selling_status,
  b.hin AS "WIN",
  b.thumb,
  b.spar_material,
  b.price,
  b.current_owners,
  b.reference,
  (o.ec -> 'rank' :: text) AS rank
FROM
  (
    (
      SELECT
        jsonb_array_elements(sort_orders."values") AS ec
      FROM
        sort_orders
      WHERE
        (sort_orders.name = 'editors_choice' :: text)
    ) o
    JOIN boat b ON ((b.oga_no = ((o.ec -> 'oga_no' :: text)) :: integer))
  );
