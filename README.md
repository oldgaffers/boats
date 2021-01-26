# oga-boat-register-frontend
React/MaterialUI/Apollo/GraphQL viewer for the OGA Boat Register
![Node.js CI](https://github.com/jcable/oga-boat-register-frontend/workflows/Node.js%20CI/badge.svg)

This website = should normally be accessed at https://www.oga.org.uk/boat_register/boat_register.html


keeping this here so we don't lose it again:

create view boatwithrank as select b.*, o.ec->'rank' as rank from (select jsonb_array_elements(values) as ec from sort_orders where name='editors_choice') o join boat b on b.oga_no = (o.ec->'oga_no')::int;

