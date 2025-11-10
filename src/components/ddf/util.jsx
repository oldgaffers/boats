import { toTitleCase } from '../../util/text_utils';

export const mapPicker = (m) => {
  return m?.map((i) => {
    if (i.name) {
      return { label: i.name, value: i.id }
    }
    return { label: i.replace('_', ' '), value: i }
  }) || [];
}

export function intField(name, label) {
  return {
    name, label,
    component: "text-field", type: "number", dataType: 'integer',
  };
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

export const extendableList = (pickers, name, label, isMulti) => {
  return [
    {
      component: 'select',
      name,
      label: isMulti ? `${label}(s)` : label,
      options: optionsFromPicker(pickers[name]),
      isMulti,
      isSearchable: true,
      isClearable: true,
      freeSolo: true,
      selectOnFocus: true,
      clearOnBlur: true,
      handleHomeEndKeys: true,
      loadOptions: async (currentSearchValue) => {
        const options = optionsFromPicker(pickers[name]);
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
