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

export const basicDimensionItems = [
  {
    component: 'text-field',
    name: "handicap_data.length_on_deck",
    label: "Length on deck (LOD) (decimal feet)",
    type: "number",
    dataType: 'float',
    isRequired: true,
    validate: [
      {
        type: 'required',
      },
    ],
    resolveProps: (props, { meta, input }, formOptions) => {
      const { values } = formOptions.getState();
      if (values.handicap_data?.length_on_deck === undefined) {
        return {
          initialValue: 30,
        };
      }
    },
  },
  {
    component: 'text-field',
    name: "handicap_data.length_on_waterline",
    label: "Waterline Length {LWL) (decimal feet)",
    type: "number",
    dataType: 'float',
    isRequired: true,
    validate: [
      {
        type: 'required',
      },
    ],
    resolveProps: (props, { meta, input }, formOptions) => {
      const { values } = formOptions.getState();
      if (values.handicap_data?.length_on_waterline === undefined) {
        return {
          initialValue: 28,
        };
      }
    },
  },
  {
    component: 'text-field',
    name: "handicap_data.beam",
    label: "Beam (decimal feet)",
    type: "number",
    dataType: 'float',
    isRequired: true,
    validate: [
      {
        type: 'required',
      },
    ],
    resolveProps: (props, { meta, input }, formOptions) => {
      const { values } = formOptions.getState();
      if (values.handicap_data?.beam === undefined) {
        return {
          initialValue: 8,
        };
      }
    },
  },
  {
    component: 'text-field',
    name: "handicap_data.draft",
    label: "Minumum Draft (decimal feet)",
    type: "number",
    dataType: 'float',
    isRequired: true,
    validate: [
      {
        type: 'required',
      },
    ],
    resolveProps: (props, { meta, input }, formOptions) => {
      const { values } = formOptions.getState();
      if (values.handicap_data?.draft === undefined) {
        return {
          initialValue: 4.5,
        };
      }
    },
  },
  {
    component: 'text-field',
    name: "air_draft",
    label: "Air Draft (decimal feet)",
    type: "number",
    dataType: 'float',
    validate: [
    ],
  },
  {
    component: 'plain-text',
    name: "ddf.h1",
    label: "LOD, LWL, beam and draft affect handicaps",
  },
];

export const constructionItems = (pickers) => {
  return [
    {
      component: 'select',
      name: "construction_material",
      label: "Construction material",
      isReadOnly: false,
      isSearchable: true,
      isClearable: true,
      options: mapPicker(pickers.construction_material),
      isOptionEqualToValue: (option, value) => option.value === value,
    },
    {
      component: 'select',
      name: "construction_method",
      label: "Construction method",
      isReadOnly: false,
      isSearchable: true,
      isClearable: true,
      options: mapPicker(pickers.construction_method),
      isOptionEqualToValue: (option, value) => option.value === value,
    },
    {
      component: 'select',
      name: "spar_material",
      label: "Spar material",
      isReadOnly: false,
      isSearchable: true,
      isClearable: true,
      options: mapPicker(pickers.spar_material),
      isOptionEqualToValue: (option, value) => option.value === value,
    },
    {
      component: 'text-field',
      name: "construction_details",
      label: "Construction details",
    },
  ];
};

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
        const r = [...options, { label: currentSearchValue, value: currentSearchValue }];
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

export const extendableItems = ({ pickers, name, label }) => {
  // console.log('extendableItems', name, label)
  return [
    {
      component: 'select',
      name,
      label,
      isReadOnly: false,
      isSearchable: true,
      isClearable: true,
      options: pickers[name].map((o) => ({ label: o.name, value: o.name })),
      noOptionsMessage: 'we don\'t have that one - you can add it below',
    },
    {
      component: 'text-field',
      condition: {
        or: [
          { when: name, isEmpty: true },
          { when: name, is: ' ' }
        ]
      },
      name: `ddf.new_${name}`,
      label: `if you can't find anything suitable add a new one here`,
      isRequired: false,
    },
  ];
};

export const genericTypeItems = (pickers) => extendableList(pickers, 'generic_type', 'Generic Type', true);
export const builderItems = (pickers) => extendableList(pickers, 'builder', 'Builder', true)
export const designerItems = (pickers) => extendableList(pickers, 'designer', 'Designer', true)
export const designClassItems = (pickers) => extendableList(pickers, 'design_class', 'Design Class', false)
