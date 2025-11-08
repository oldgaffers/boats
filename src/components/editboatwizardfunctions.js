import { v4 as uuidv4 } from 'uuid';
import { create } from 'jsondiffpatch';

import { boatm2f, boatf2m, boatDefined } from "../util/format";

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
  const { name, oga_no, image_key, for_sales, for_sale_state, ...rest } = boat;
  const email = user?.email || '';
  const ddf = { name, oga_no, image_key, owner, editor, pr };

  const defaultSalesRecord = {
    created_at: new Date().toISOString(),
    asking_price: 0,
    sales_text: '',
    flexibility: 'normal',
  };

  const sales_records = [...(for_sales || [])].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));

  if (boat.selling_status === 'for_sale') {
    ddf.current_sales_record = { ...defaultSalesRecord, ...sales_records.shift() };
  } else {
    ddf.current_sales_record = defaultSalesRecord;
  }

  const initialValues = { ddf, email, ...boatm2f(rest) };

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

  // ownersWithId.sort((a, b) => a.start > b.start);
  // console.log('IV', initialValues)

  return initialValues;

}

export function salesChanges(ddf, for_sales) {
  if (ddf.update_sale === 'update') {
    return {
      selling_status: 'for_sale',
      for_sales: [ddf.current_sales_record, ...for_sales],
    }
  }
  if (ddf.update_sale === 'unsell') {
    return {
      selling_status: 'not_for_sale',
      for_sales: [ddf.current_sales_record, ...for_sales],
    }
  }
  if (ddf.update_sale === 'sold') {
    return {
      selling_status: 'not_for_sale',
      for_sales: [ddf.current_sales_record, ...for_sales],
    }
  }
  if (ddf.confirm_for_sale === true) {
    return {
      selling_status: 'for_sale',
      for_sales: [ddf.current_sales_record, ...for_sales],
    }
  }
  return { for_sales };
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

export function getNewItems(boat, pickers) {
  return Object.fromEntries(
    ['builder', 'designer', 'design_class']
      .map((key) => [key, boat[key]?.filter((v) => !pickers[key].includes(v?.name))])
      .map((v) => { console.log(JSON.stringify(v)); return v;})
      .filter(([key, name]) => name)
      .map(([key, name]) => [key, { name, id: uuidv4() }])
  );
}

export function prepareModifiedValues(values, boat, pickers) {
  const { name, oga_no, image_key, selling_status, for_sales } = boat
  const { ddf, email, ownerships, previous_names = [], ...submitted } = values;

  const sales_records = [...(for_sales || [])].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));

  if (selling_status === 'for_sale') {
    sales_records.shift();
  }

  function name2object(value, picker, newItem) {
    // console.log('name2object', value, newItem);
    if (newItem) {
      return newItem;
    }
    if (value?.name) {
      return value;
    }
    const r = picker.find((p) => p.name === value);
    if (r) {
      return r;
    }
    return undefined; // not possible to specify a value we don't have
  }

  function listMapper(values, newItems, field) {
    if (values[field]) {
      const r = values[field].map((v) => name2object(v, pickers[field]));
      if (newItems[field]) {
        r.push(newItems[field]);
      }
      return r;
    } else {
      if (newItems[field]) {
        return [newItems[field]];
      }
    }
    return undefined;
  }
  
  const newItems = getNewItems(boat, pickers);

  const design_class = name2object(values.design_class, pickers.design_class, newItems.design_class);

  const builder = listMapper(values, newItems, 'builder');
  const designer = listMapper(values, newItems, 'designer');

  if (ddf.new_name) {
    previous_names.unshift([name]);
  }

  const modifiedBoat = {
    ...boatf2m(submitted),
    ownerships: updateOwnerships(boat.ownerships, ownerships),
    name: ddf.new_name || name || submitted.name,
    previous_names,
    oga_no, image_key,
    ...salesChanges(ddf, sales_records),
    builder,
    designer,
    design_class,
  };

  return { boat: boatDefined(modifiedBoat), newItems, email };
}

export function oldvalue(path, boat) {
  const [, root, ...p] = path.split('/');
  return p.reduce((prev, current) => prev[current], boat[root]);
}


