import { componentTypes } from "@data-driven-forms/react-form-renderer";

const handicapForm = {
    name: "handicap",
    title: "Handicap Data",
    description: `This form collects the information needed to calculate a traditional TH(C)F
handicap and the extra data for experimental and area handicaps. You can enter the data in either decimal feet or in metres.`,
    component: componentTypes.SUB_FORM,
    fields: [
      {
        name: 'units',
        component: componentTypes.SWITCH,
        label: "Enter values in",
        onText: 'decimal feet',
        offText: 'metres'  
      },
      {
        component: componentTypes.RADIO,
        name: "ddf_collect_headsail_data",
        label: "Collect headsail data",
        "options": [
          {label: 'Yes', value: true},
          {label: 'No', value: false},
        ],
      }
    ]
  };

  const sailAreaForm = {
      title: "Sail Area",
      name: "sa",
      component: componentTypes.SUB_FORM,
      fields: [
        {
          component: componentTypes.TEXT_FIELD,
          name: "handicap_data~sailarea",
          label: "Area in square feet",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: "handicap_data~fore_triangle_height",
          label: "Fore Triangle Height",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: "handicap_data~fore_triangle_base",
          label: "Fore Triangle Base",
          dataType: 'float'
        },
      ]
    };
    /*
    length_overall
    length_on_waterline
    length_over_spars
    moving_keel
    draft_keel_up
    draft_keel_down
    "moving_keel_type": Centreboard|Leeboard, 
    calculated_thcf
  "main": {"foot": 15.9, "head": 11.3, "luff": 13.4}, 
mizzen": {"foot": 3.33, "luff": 7.5}
 sailarea
 "topsail": {"luff": 16, "perpendicular": 12}

    */

    const luffLeachFootForm = (title, name) => {
      return {
      title,
      name,
      component: componentTypes.SUB_FORM,
      fields: [
        {
          component: componentTypes.TEXT_FIELD,
          name: `${name}~luff`,
          label: "Luff",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: `${name}~leach`,
          label: "Leach",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: `${name}~foot`,
          label: "Foot",
          dataType: 'float'
        },
      ]
    };
  };

  const gaffForm = (title, name) => {
    return {    
      title,
      name,
      component: componentTypes.SUB_FORM,
      fields: [
        {
          component: componentTypes.TEXT_FIELD,
          name: `${name}~luff`,
          label: "Luff",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: `${name}~head`,
          label: "Head",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: `${name}~foot`,
          label: "Foot",
          dataType: 'float'
        },
      ]
    }
  };

  const topslForm = (title, name) => {
    return {
      title,
      name,
      component: componentTypes.SUB_FORM,
      fields: [
        {
          component: componentTypes.TEXT_FIELD,
          name: `${name}~luff`,
          label: "Luff",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: `${name}~perpendicular`,
          label: "Perpendicular",
          dataType: 'float'
        },
      ]
    }
  }

const propellorForm = {
      title: "Propeller type",
      name: "handicap_data~prop",
      component: componentTypes.SUB_FORM,
      fields: [
        {
          component: componentTypes.RADIO,
          name: "propeller_type",
          label: "Select",
          "options": [
            {label: 'None', value: 'none'},
            {label: 'Fixed', value: 'fixed'},
            {label: 'Folding', value: 'folding'},
            {label: 'Feathering', value: 'feathering'},
          ],
        }
      ]
    };
  
  export const steps = (pickers) => [
    {
      name: "handicap-step",
      nextStep: "hull_measurements-step",  
      nextStep: "sa-step",
      fields: [handicapForm],
    },
    {
      name: "sa-step",
      nextStep: "bigs-step",
      fields: [sailAreaForm],
    },
    {
      name: "bigs-step",
      nextStep: "bigj-step",
      fields: [luffLeachFootForm('Biggest Staysail', 'handicap_data~biggest_staysail')]
    },
    {
      name: "bigj-step",
      nextStep: "bigdw-step",
      fields: [luffLeachFootForm('Biggest Jib', 'handicap_data~biggest_jib')]
    },
    {
      name: "bigdw-step",
      nextStep: "main-step",
      fields: [luffLeachFootForm('Biggest Downwind sail', 'handicap_data~biggest_downwindsail')]
    },
    {
      name: "main-step",
      nextStep: "top-step",
      fields: [gaffForm('Main sail', 'handicap_data~main')]
    },
    {
      name: "top-step",
      nextStep: "mizen-step",
      fields: [topslForm('topsail', 'handicap_data~topsail')]
    },
    {
      name: "mizen-step",
      nextStep: "miztop-step",
      fields: [gaffForm('Mizen', 'handicap_data~mizen')]
    },
    {
      name: "miztop-step",
      nextStep: "prop-step",
      fields: [topslForm('Mizen topsail', 'handicap_data~mizen_topsail')]
    },
    {
      name: "prop-step",
      fields: [propellorForm]
    }
  ];
