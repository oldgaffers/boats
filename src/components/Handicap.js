import { componentTypes } from "@data-driven-forms/react-form-renderer";

export const steps = (pickers) => [
  {
    title: "Handicap Data",
    name: "handicap",
    component: componentTypes.SUB_FORM,
    "nextStep": "hull_measurements",
    fields: [
      {
        component: componentTypes.PLAIN_TEXT,
        name: "hcintro",
        label: `This form collects the information needed to calculate a traditional TH(C)F
handicap and the extra data for experimental and area handicaps. You can enter the data in either decimal feet or in metres.`
      },
      {
        component: componentTypes.SWITCH,
        name: "units",
        label: "Units",
        onText: 'decimal feet',
        offText: 'metres'
      },
    ]
  },
  {
      title: "Hull Measurements",
      name: "hull_measurements",
      component: componentTypes.SUB_FORM,
      "nextStep": "sa",
      fields: [
        {
          component: componentTypes.PLAIN_TEXT,
          name: "hcintro",
          label: "LWL excludes rudder.\nDepth is from the lowest part of the boat to the gunwale.",
        },
        {
          component: componentTypes.TEXT_FIELD,
          label: "Length over spars",
          name: "LOS",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          label: "Length on waterline",
          name: "LWL",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: "beam",
          label: "Beam",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: "depth",
          label: "Depth",
          dataType: 'float'
        }
      ]
    },
    {
      title: "Sail Area",
      name: "sa",
      component: componentTypes.SUB_FORM,
      "nextStep": "rhs",
      fields: [
        {
          component: componentTypes.TEXT_FIELD,
          name: "sailarea",
          label: "Area in square feet",
          dataType: 'float'
        }
      ]
    },
    {
      title: "Do you set head sails when racing?",
      name: "rhs",
      component: componentTypes.SUB_FORM,
      "nextStep": "foretri",
      fields: [
        {
          component: componentTypes.RADIO,
          name: "collect_headsail_data",
          label: "Select",
          "options": [
            {label: 'Yes', value: true},
            {label: 'No', value: false},
          ],
        }
      ]
    },
    {
      title: "Fore Triangle",
      name: "foretri",
      component: componentTypes.SUB_FORM,
      "nextStep": "bigs",
      fields: [
        {
          component: componentTypes.TEXT_FIELD,
          name: "height",
          label: "Height",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: "base",
          label: "Base",
          dataType: 'float'
        },
      ]
    },
    {
      title: "Biggest Staysail",
      name: "bigs",
      component: componentTypes.SUB_FORM,
      "nextStep": "bigj",
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
    },
    {
      title: "Biggest Jib",
      description: "Biggest Jib desc",
      name: "bigj",
      component: componentTypes.SUB_FORM,
      "nextStep": "bigdw",
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
    },
    {
      title: "Biggest Downwind Sail",
      name: "bigdw",
      component: componentTypes.SUB_FORM,
      "nextStep": "main",
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
    },
    {
      title: "Main Sail",
      name: "main",
      component: componentTypes.SUB_FORM,
      "nextStep": "top",
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
    },
    {
      title: "Topsail",
      name: "top",
      component: componentTypes.SUB_FORM,
      "nextStep": "mizen",
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
    },
    {
      title: "Mizen",
      name: "mizen",
      component: componentTypes.SUB_FORM,
      "nextStep": "miztop",
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
    },
    {
      title: "Mizen Topsail",
      name: "miztop",
      component: componentTypes.SUB_FORM,
      "nextStep": "prop",
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
    },
    {
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
    },
  ];
  