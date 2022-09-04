# oga-boat-register-frontend
React/MaterialUI/Apollo/GraphQL viewer for the OGA Boat Register
![Deploy to Pages](https://github.com/github/docs/actions/workflows/build.pages.yml/badge.svg)

This micro-site = should normally be accessed at https://www.oga.org.uk/boat_register/boat_register.html

# Build and Deployment

Pages are hosted on www.oga.org.uk and load the main javascript.

The javascript is hosted at https://oldgaffers.github.io/boats/main.js

Deploying to https://oldgaffers.github.io/boats/ is a Github Actions workflow triggered
by a push or pull-request to the main branch.

keeping this here so we don't lose it again:

create view boatwithrank as select b.*, o.ec->'rank' as rank from (select jsonb_array_elements(values) as ec from sort_orders where name='editors_choice') o join boat b on b.oga_no = (o.ec->'oga_no')::int;

