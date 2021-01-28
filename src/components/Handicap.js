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
        name: "collect_headsail_data",
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
          name: "sailarea",
          label: "Area in square feet",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: "height",
          label: "Fore Triangle Height",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: "base",
          label: "Fore Triangle Base",
          dataType: 'float'
        },
      ]
    };

    const luffLeachFootForm = (title, name) => {
      return {
      title,
      name,
      component: componentTypes.SUB_FORM,
      fields: [
        {
          component: componentTypes.TEXT_FIELD,
          name: "luff",
          label: "Luff",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: "leach",
          label: "Leach",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: "foot",
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
          name: "luff",
          label: "Luff",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: "head",
          label: "Head",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: "foot",
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
          name: "luff",
          label: "Luff",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: "perpendicular",
          label: "Perpendicular",
          dataType: 'float'
        },
      ]
    }
  }

const propellorForm = {
      title: "Propeller type",
      name: "prop",
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
      fields: [luffLeachFootForm('Biggest Staysail', 'bigs')]
    },
    {
      name: "bigj-step",
      nextStep: "bigdw-step",
      fields: [luffLeachFootForm('Biggest Jib', 'bigj')]
    },
    {
      name: "bigdw-step",
      nextStep: "main-step",
      fields: [luffLeachFootForm('Biggest Downwind sail', 'bigdw')]
    },
    {
      name: "main-step",
      nextStep: "top-step",
      fields: [gaffForm('Main sail', 'main')]
    },
    {
      name: "top-step",
      nextStep: "mizen-step",
      fields: [topslForm('topsail', 'top')]
    },
    {
      name: "mizen-step",
      nextStep: "miztop-step",
      fields: [gaffForm('Mizen', 'mizen')]
    },
    {
      name: "miztop-step",
      nextStep: "prop-step",
      fields: [topslForm('Mizen topsail', 'miztop')]
    },
    {
      name: "prop-step",
      fields: [propellorForm]
    }
  ];
