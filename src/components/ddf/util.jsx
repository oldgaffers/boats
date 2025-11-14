import { toTitleCase } from '../../util/text_utils';
import { getPicklist, postNewValues } from '../../util/api';

export const mapPicker = (m) => {
  return m?.map((i) => {
    if (i.name) {
      return { label: i.name, value: i.id }
    }
    return { label: i.replace('_', ' '), value: i }
  }) || [];
}

function optionlist(p) {
  const l = [...new Set(p.filter((o) => o && o.trim() !== ''))];
  return l.map((o) => ({ label: o, value: o }));
}

function optionsFromPicker(p) {
  if (Array.isArray(p)) {
    if (p.length === 0) {
      return [];
    }
    if (typeof p[0] === 'string') {
      return optionlist(p);
    }
    return optionlist(p.map((o) => o.name));
  }
  return [];
}

export const extendableList = (name, isMulti) => {
  const label = toTitleCase(name.replace('_', ' '));
  return [
    {
      component: 'select',
      name,
      label: isMulti ? `${label}(s)` : label,
      isMulti,
      isSearchable: true,
      isClearable: true,
      freeSolo: true,
      selectOnFocus: true,
      clearOnBlur: true,
      handleHomeEndKeys: true,
      loadOptions: async (currentSearchValue) => {
        const picklist = await getPicklist(name);
        const options = optionsFromPicker(picklist);
        if (!currentSearchValue) {
          return options;
        }
        if (options.includes(currentSearchValue)) {
          return options;
        }
        const v = toTitleCase(currentSearchValue.trim());
        const r = [...options, { label: v, value: v }];
        return r;
      },
    },
    // {
    //   component: 'text-field',
    //   name: 'XX',
    //   resolveProps: (props, { meta, input }, formOptions) => {
    //     const { values } = formOptions.getState();
    //     return {
    //       initialValue: JSON.stringify(values[name]),
    //     };
    //   },
    // },
  ];
};

export const newItemMonitor = (name) => ({
  component: 'text-field',
  name: `ddf.new_${name}_monitor`,
  label: name,
  hideField: true,
  resolveProps: (props, { meta, input }, formOptions) => {
    const { values } = formOptions.getState();
    const selected = Array.isArray(values[name]) ? values[name] : (values[name] ? [values[name]] : []);
    getPicklist(name).then((picklist) => {
      const picklistNames = picklist.map((p) => (p.name || p));
      const newValues = selected.filter((v) => !picklistNames.includes(v));
      if (newValues.length > 0) {
        postNewValues(name, newValues).then(() => {
          console.log(`posted new ${name}`, newValues);
        });
      }
    });
    return { value: JSON.stringify(selected) };
  },
});
