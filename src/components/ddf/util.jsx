import { componentTypes } from "@data-driven-forms/react-form-renderer";

export const mapPicker = (m) => {
  return m.map((val) => {
    if (val.id) {
      return { label: val.name, value: val.id }
    }
    return { label: val.name, value: val.name }
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
        label: `a ${label.toLowerCase()} not listed`,
        isRequired: false,
      },
    ];
  };
  
  export const builderItems = (pickers) => extendableItems({pickers, name: 'builder', label: 'Builder'})
  export const designerItems = (pickers) => extendableItems({pickers, name: 'designer', label: 'Designer'})
  export const designClassItems = (pickers) => extendableItems({pickers, name: 'design_class', label: 'Design Class'})
