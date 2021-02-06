import { componentTypes } from "@data-driven-forms/react-form-renderer";
import { m2df, m2dsqf, f2m, f2m2 } from '../util/format';
import { thcf } from '../util/THCF';

function m2fall(o) {
  if(o) {
      Object.keys(o).map(k => m2df(o[k]));
  }
}

export function hcm2f(hc) {
  if(hc) {
    return {
      ...hc,
      sailarea: m2dsqf(hc.sailarea),
      depth: m2df(hc.depth),
      fore_triangle_height: m2df(hc.fore_triangle_height),
      fore_triangle_base: m2df(hc.fore_triangle_base),
      length_overall: m2df(hc.length_overall),
      length_on_waterline: m2df(hc.length_on_waterline),
      length_over_spars: m2df(hc.length_over_spars),
      draft_keel_up: m2df(hc.draft_keel_up),
      draft_keel_down: m2df(hc.draft_keel_down),
      main: m2fall(hc.main),
      mizen: m2fall(hc.mizen),
      topsail: m2fall(hc.topsail),
      mizen_topsail: m2fall(hc.mizen_topsail),
      biggest_staysail: m2fall(hc.biggest_staysail),
      biggest_jib: m2fall(hc.biggest_jib),
      biggest_downwindsail: m2fall(hc.biggest_downwindsail),
    }
  }
}

function f2mall(o) {
  if(o) {
      Object.keys(o).map(k => f2m(o[k]));
  }
}

export function hcf2m(hc) {
  if(hc) {
    return {
      ...hc,
      sailarea: f2m2(hc.sailarea),
      depth: f2m(hc.depth),
      fore_triangle_height: f2m(hc.fore_triangle_height),
      fore_triangle_base: f2m(hc.fore_triangle_base),
      length_overall: f2m(hc.length_overall),
      length_on_waterline: f2m(hc.length_on_waterline),
      length_over_spars: f2m(hc.length_over_spars),
      draft_keel_up: f2m(hc.draft_keel_up),
      draft_keel_down: f2m(hc.draft_keel_down),
      main: f2mall(hc.main),
      mizen: f2mall(hc.mizen),
      topsail: f2mall(hc.topsail),
      mizen_topsail: f2mall(hc.mizen_topsail),
      biggest_staysail: f2mall(hc.biggest_staysail),
      biggest_jib: f2mall(hc.biggest_jib),
      biggest_downwindsail: f2mall(hc.biggest_downwindsail),
    }
  }
}

function fmt(state) {
  console.log('fmt', state.values);
  return thcf(state.values);
}

const handicapForm = {
    name: "handicap",
    title: "Handicap Data",
    description: `This form collects the information needed to calculate a traditional T(H)CF
handicap and the extra data for experimental and area handicaps.`,
    //  You can enter the data in either decimal feet or in metres.
    component: componentTypes.SUB_FORM,
    fields: [
      /*
      {
        name: 'units',
        component: componentTypes.SWITCH,
        label: "Enter values in",
        onText: 'decimal feet',
        offText: 'metres'  
      },
      */
     {
       component: componentTypes.TEXT_FIELD,
       name: 'handicap_data.calculated_thcf',
       resolveProps: (props, {meta, input}, formOptions) => ({ 
         label: `calculated value is ${fmt(formOptions.getState())}, stored value is`
        })
     },
      {
        component: componentTypes.RADIO,
        name: "ddf.collect_headsail_data",
        label: "Collect headsail data",
        initialValue: 'yes',
        "options": [
          {label: 'Yes', value: 'yes'},
          {label: 'No', value: 'no'},
        ],
      }
    ]
  };

  const sailAreaForm = {
      title: "Basic Data",
      name: "sa",
      component: componentTypes.SUB_FORM,
      fields: [
        {
          component: componentTypes.TEXT_FIELD,
          name: "handicap_data.sailarea",
          label: "Sail Area (decimal square feet)",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: "handicap_data.fore_triangle_height",
          label: "Fore Triangle Height (decimal feet)",
          description: "measured from deck to the top of the highest headsail halyard sheave (for jib topsail if one can be flown)",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: "handicap_data.fore_triangle_base",
          label: "Fore Triangle Base (decimal feet)",
          description: "measured from the foreside of the mast to the eye of the fitting which sets the tack of the furthest forward headsail, or to the sheave of the jib outhaul at the end of the bowsprit",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: "handicap_data.depth",
          label: "Depth (decimal feet)",
          description: "internal depth amidships from top of keelson to a line joining the underside of the deck planking at the sides of the hull",
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
      title: `${title} (decimal feet)`,
      name,
      component: componentTypes.SUB_FORM,
      fields: [
        {
          component: componentTypes.TEXT_FIELD,
          name: `${name}.luff`,
          label: "Luff",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: `${name}.leach`,
          label: "Leach",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: `${name}.foot`,
          label: "Foot",
          dataType: 'float'
        },
      ]
    };
  };

  const gaffForm = (title, name) => {
    return {    
      title: `${title} (decimal feet)`,
      name,
      component: componentTypes.SUB_FORM,
      fields: [
        {
          component: componentTypes.TEXT_FIELD,
          name: `${name}.luff`,
          label: "Luff",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: `${name}.head`,
          label: "Head",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: `${name}.foot`,
          label: "Foot",
          dataType: 'float'
        },
      ]
    }
  };

  const topslForm = (title, name) => {
    return {
      title: `${title} (decimal feet)`,
      name,
      component: componentTypes.SUB_FORM,
      fields: [
        {
          component: componentTypes.TEXT_FIELD,
          name: `${name}.luff`,
          label: "Luff",
          dataType: 'float'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: `${name}.perpendicular`,
          label: "Perpendicular",
          dataType: 'float'
        },
      ]
    }
  }

const propellerForm = {
      title: "Propeller",
      name: "handicap_data.prop",
      component: componentTypes.SUB_FORM,
      fields: [
        {
          component: componentTypes.TEXT_FIELD,
          name: "handicap_data.propeller_blades",
          label: "Blades",
          dataType: 'integer',
        },
        {
          component: componentTypes.RADIO,
          name: "handicap_data.propeller_type",
          label: "Propeller type",
          "options": [
            {label: 'None', value: 'none'},
            {label: 'Fixed', value: 'fixed'},
            {label: 'Folding', value: 'folding'},
            {label: 'Feathering', value: 'feathering'},
          ],
        }
      ]
    };
  
  export const steps = [
    {
      name: "handicap-step",
      nextStep: "sa-step",
      fields: [handicapForm],
    },
    {
      name: "sa-step",
      nextStep: {
        when: 'ddf.collect_headsail_data',
        stepMapper: {
          yes: 'bigs-step',
          no: 'main-step',
        },
      },
      fields: [sailAreaForm],
    },
    {
      name: "bigs-step",
      nextStep: "bigj-step",
      fields: [luffLeachFootForm('Biggest Staysail', 'handicap_data.biggest_staysail')]
    },
    {
      name: "bigj-step",
      nextStep: "bigdw-step",
      fields: [luffLeachFootForm('Biggest Jib', 'handicap_data.biggest_jib')]
    },
    {
      name: "bigdw-step",
      nextStep: "main-step",
      fields: [luffLeachFootForm('Biggest Downwind sail', 'handicap_data.biggest_downwindsail')]
    },
    {
      name: "main-step",
      nextStep: "top-step",
      fields: [gaffForm('Main sail', 'handicap_data.main')]
    },
    {
      name: "top-step",
      nextStep: ({ values }) => (values.rig_type === 'Ketch' || values.rig_type === 'Yawl') ? 'mizen-step' : 'prop-step',
      fields: [topslForm('topsail', 'handicap_data.topsail')]
    },
    {
      name: "mizen-step",
      nextStep: "miztop-step",
      fields: [gaffForm('Mizen', 'handicap_data.mizen')]
    },
    {
      name: "miztop-step",
      nextStep: "prop-step",
      fields: [topslForm('Mizen topsail', 'handicap_data.mizen_topsail')]
    },
    {
      name: "prop-step",
      nextStep: "done-step",
      fields: [propellerForm]
    }
  ];
