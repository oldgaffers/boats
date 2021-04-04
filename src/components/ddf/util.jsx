import { componentTypes } from "@data-driven-forms/react-form-renderer";
import { mapPicker } from "../Rig";

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
