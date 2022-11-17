import { componentTypes } from "@data-driven-forms/react-form-renderer";

export const mapPicker = (m) => {
  console.log('mapPicker', m);
  return m.map((i) => {
    if (i.name) {
      return { label: i.name, value: i.id }
    }
    return { label: i.replace('_', ' '), value: i }
  });
}

export const constructionItems = (pickers) => {
  return [
  {
    component: componentTypes.SELECT,
    name: "construction_material",
    label: "Construction material",
    isReadOnly: false,
    isSearchable: true,
    isClearable: true,
    options: mapPicker(pickers.construction_material),
  },
  {
    component: componentTypes.SELECT,
    name: "construction_method",
    label: "Construction method",
    isReadOnly: false,
    isSearchable: true,
    isClearable: true,
    options: mapPicker(pickers.construction_method),
  },
  {
    component: componentTypes.SELECT,
    name: "spar_material",
    label: "Spar material",
    isReadOnly: false,
    isSearchable: true,
    isClearable: true,
    options: mapPicker(pickers.spar_material),
  },
  {
    component: componentTypes.TEXT_FIELD,
    name: "construction_details",
    label: "Construction details",
  },
];
};

export const extendableItems = ({pickers, name, label}) => {
    return [
      {
        component: componentTypes.SELECT,
        name,
        label,
        isReadOnly: false,
        isSearchable: true,
        isClearable: true,
        options: mapPicker(pickers[name]),
      },
      {
        component: componentTypes.TEXT_FIELD,
        condition: {
          when: name,
          isEmpty: true,
        },
        name: `new_${name}`,
        label: `if the ${label.toLowerCase()} is not listed and you know the name add it here`,
        isRequired: false,
      },
    ];
  };
  
  export const builderItems = (pickers) => extendableItems({pickers, name: 'builder', label: 'Builder'})
  export const designerItems = (pickers) => extendableItems({pickers, name: 'designer', label: 'Designer'})
  export const designClassItems = (pickers) => extendableItems({pickers, name: 'design_class', label: 'Design Class'})
