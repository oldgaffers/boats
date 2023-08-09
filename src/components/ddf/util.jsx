export const mapPicker = (m) => {
  return m?.map((i) => {
    if (i.name) {
      return { label: i.name, value: i.id }
    }
    return { label: i.replace('_', ' '), value: i }
  }) || [];
}

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
      label: `if the ${label.toLowerCase()} is not listed and you know the name add it here`,
      isRequired: false,
    },
  ];
};

export const builderItems = (pickers) => extendableItems({ pickers, name: 'builder', label: 'Builder' })
export const designerItems = (pickers) => extendableItems({ pickers, name: 'designer', label: 'Designer' })
export const designClassItems = (pickers) => extendableItems({ pickers, name: 'design_class', label: 'Design Class' })
