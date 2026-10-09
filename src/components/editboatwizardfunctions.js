import { v4 as uuidv4 } from 'uuid';
import { create } from 'jsondiffpatch';
import { boatm2f, boatf2m, boatDefined } from "../util/format";
import { fThcf } from '../util/THCF';
import { currentSaleRecord, modified, prepareSalesRecord, salesChanges } from '../util/sale_record';

export function boatdiff(before, after) {
  const cj = create({
    objectHash: (obj) => `${obj.id || obj.name}-${obj.start}`,
    textDiff: { minLength: 60000 }, // prevent textdiff not supported by the RFC formatter
  });
  return cj.diff(before, after);
}

export function prepareInitialValues(boat, user, pr) {
  const ownerids = boat.ownerships?.filter((o) => o.current)?.map((o) => o.id) || [];
  const goldId = user?.['https://oga.org.uk/id'];
  const editor = (user?.['https://oga.org.uk/roles'] || []).includes('editor');
  const owner = (!!goldId) && ownerids.includes(goldId);
  const { name, oga_no, image_key, ...rest } = boat;
  const email = user?.email || '';
  const current_sales_record = prepareSalesRecord(boat);
  const ddf = { name, oga_no, image_key, owner, editor, pr, current_sales_record };

  if (boat.handicap_data?.main?.type || boat.handicap_data?.fore?.type || boat.handicap_data?.mizzen?.type ) {
    console.log(boat.handicap_data);
    ddf.sail_type = { };
    if (boat.handicap_data.main?.type) ddf.sail_type.main = boat.handicap_data.main.type;
    if (boat.handicap_data.fore?.type) ddf.sail_type.fore = boat.handicap_data.fore.type;
    if (boat.handicap_data.mizzen?.type) ddf.sail_type.mizzen = boat.handicap_data.mizzen.type;
  }

  const initialValues = { ddf, email, ...boatm2f(rest) };

  ddf.thcf = fThcf(initialValues);
  if (!initialValues.handicap_data) {
    initialValues.handicap_data = {};
  }
  if (initialValues.handicap_data.thcf === undefined) {
    initialValues.handicap_data.thcf = '-';
  }

  // prepare for dual-list note, generic type is already ok
  ['builder', 'designer'].forEach((key) => {
    const val = initialValues[key];
    if (val) {
      initialValues[key] = val.filter((v) => v).map((v) => v?.name);
    } else {
      initialValues[key] = [];
    }
  });
  ['design_class'].forEach((key) => {
    initialValues[key] = initialValues[key]?.name;
  });

  const ownersWithId = (boat.ownerships || [])
    .filter((owner) => owner.name || owner.id) // remove note and text rows
    .map((owner, index) => {
      return {
        ...owner,
        id: index,
        goldId: owner.id, // needed for ownerName? name has already been merged in!!!
      };
    });

  initialValues.ownerships = ownersWithId;

  return initialValues;

}

export function updateOwnerships(old = [], updated = []) {
  const notes = old.filter((o) => !(o.name || o.id))
  // console.log(notes, updated);
  const withoutRowIds = updated.map((o) => {
    const { id, goldId, ...rest } = o;
    if (goldId) {
      rest.id = goldId;
    }
    return rest;
  })
  return [...withoutRowIds, ...notes];
}

export function getNewItems(field = [], picker = []) {
  const pn = picker.map(p => p.name || p);
  return field
    ?.filter(f => f && !(pn.includes(f) || pn.includes(f?.name)))
    ?.map(f => ({ name: f.name || f, id: uuidv4() }));
}

export function getAllNewItems(boat, pickers) {
  const multi = ['builder', 'designer', 'generic_type']
    .map(key => [key, getNewItems(boat[key], pickers[key])])
    .filter(([k, v]) => v?.length > 0);
  const single = ['design_class']
    .map(key => [key, getNewItems([boat[key]], pickers[key])])
    .filter(([k, v]) => v?.length > 0);
  return Object.fromEntries([...single, ...multi]);
}

function name2object(value, picker = [], newItem = []) {
  if (value?.name) {
    return value;
  }
  const choices = [...newItem, ...picker];
  const r = choices.find((p) => p.name === value);
  if (r) {
    return r;
  }
  return undefined; // not possible to specify a value we don't have
}

function listMapper(values, newItems, field, pickers) {
  if (values[field]) {
    return values[field].map((v) => name2object(v, pickers[field], newItems[field]));
  }
  return undefined;
}

export function prepareModifiedValues(values, boat, pickers) {
  const { name, oga_no, image_key } = boat
  const { ddf, email, ownerships, previous_names = [], ...submitted } = values;

  const newItems = getAllNewItems(submitted, pickers);

  if (ddf.new_name) {
    previous_names.unshift([name]);
  }

  if (submitted.handicap_data.thcf === '-') {
    submitted.handicap_data.thcf = undefined
  }

  if (ddf.sail_type) {
    if (ddf.sail_type.main) {
      if (submitted.handicap_data.main) {
        submitted.handicap_data.main.type = ddf.sail_type.main;
      } else {
        submitted.handicap_data.main = { type: ddf.sail_type.main };
      }
    }
    if (ddf.sail_type.fore) {
      if (submitted.handicap_data.fore) {
        submitted.handicap_data.fore.type = ddf.sail_type.fore;
      } else {
        submitted.handicap_data.fore = { type: ddf.sail_type.fore };
      }
    }
    if (ddf.sail_type.mizzen) {
      if (submitted.handicap_data.mizzen) {
        submitted.handicap_data.mizzen.type = ddf.sail_type.mizzen;
      } else {
        submitted.handicap_data.mizzen = { type: ddf.sail_type.mizzen };
      }
    }
  }

  const modifiedBoat = {
    ...boatf2m(submitted),
    ownerships: updateOwnerships(boat.ownerships, ownerships),
    name: ddf.new_name || name || submitted.name,
    previous_names,
    oga_no, image_key,
    ...salesChanges(ddf.update_sale, ddf.current_sales_record, boat),
    builder: listMapper(values, newItems, 'builder', pickers),
    designer: listMapper(values, newItems, 'designer', pickers),
    design_class: name2object(values.design_class, pickers.design_class, newItems.design_class),
  };
  const b = boatDefined(modifiedBoat);
  console.log(ddf, b);
  return { boat: b, newItems, email };
}

export function oldvalue(path, boat) {
  const [, root, ...p] = path.split('/');
  return p.reduce((prev, current) => prev[current], boat[root]);
}


