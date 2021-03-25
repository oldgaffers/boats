import { componentTypes, dataTypes } from "@data-driven-forms/react-form-renderer";
import { m2dfn, m2dsqfn, f2m, f2m2 } from '../util/format';
import { thcf, rig_allowance } from '../util/THCF';

const metreKeys = [
  'beam','draft','perpendicular','luff','head','foot',
  'length_on_deck','length_on_waterline','length_over_all',
  'fore_triangle_height','fore_triangle_base',
];
const squareMetreKeys = ['sailarea'];

export function boatm2f(obj) {
  if(obj) {
    if(obj.mainsail_type) {
      if(obj.handicap_data) {
        obj.handicap_data.main.type = obj.mainsail_type;
      } else {
        obj.handicap_data = { main: { type: obj.mainsail_type } };
      }
    }
    if(Array.isArray(obj)) {
      return obj.map((n) => boatm2f(n))
    } else if (typeof obj === 'object') {
      const r = {};
      Object.keys(obj).forEach(k => {
        if(metreKeys.includes(k)) {
          r[k] = m2dfn(obj[k]);
        } else if(squareMetreKeys.includes(k)) {
          r[k] = m2dsqfn(obj[k]);
        } else {
          r[k] = boatm2f(obj[k]);
        }
      });
      return r;
    } else {
      return obj;
    }
  }
  console.log(obj);
  return obj;
}

export function boatf2m(obj) {
  if(obj) {
    if(Array.isArray(obj)) {
      return obj.map((n) => boatm2f(n))
    } else if (typeof obj === 'object') {
      const r = {};
      Object.keys(obj).forEach(k => {
        if(metreKeys.includes(k)) {
          r[k] = f2m(obj[k]);
        } else if(squareMetreKeys.includes(k)) {
          r[k] = f2m2(obj[k]);
        } else {
          r[k] = boatf2m(obj[k]);
        }
      });
      return r;
    } else {
      return obj;
    }
  }
  return obj;
}

export function m2fall(o) {
  if(o) {
      return Object.keys(o).map(k => m2dfn(o[k]));
  }
}

export function foretriangle_area({fore_triangle_height, fore_triangle_base}) {
  if(fore_triangle_height && fore_triangle_base) {
    return 0.85*0.5*fore_triangle_height*fore_triangle_base;
  }
  return 0;
}

export function mainsail_area(sail) {
  if(sail) {
    const type = sail.type;
    if(type === 'bermudan' || type === 'gunter') {
      if(sail.luff && sail.foot) {
        return 0.5*sail.luff*sail.foot;
      }
      return 0;
    }
    const { luff, head, foot } = sail;
    if(luff && head && foot) {
      return 0.5*luff*foot + 0.5*head*Math.sqrt(foot*foot+luff*luff);
    }  
  }
  return 0;
}

export function topsail_area(sail) {
  if(sail) {
    if(sail.luff && sail.perpendicular) {
      return 0.5*sail.luff*sail.perpendicular;
    }  
  }
  return 0;
}

export function sail_area({values}) {
  let total = foretriangle_area(values.handicap_data);
  total += mainsail_area(values.mainsail_type, values.handicap_data.main);
  total += topsail_area(values.handicap_data.topsail);
  if(values.rig_type === 'Schooner') {
    total += mainsail_area(values.mainsail_type, values.handicap_data.fore);
    total += topsail_area(values.handicap_data.fore_topsail);  
  }
  if(['Ketch', 'Yawl'].includes(values.rig_type)) {
    total += mainsail_area(values.mainsail_type, values.handicap_data.mizen);
    total += topsail_area(values.handicap_data.mizen_topsail);  
  }
  return total;
}

function corrected_sailarea(sa, rig_type) {
  const factor = {
    Sloop: 1.0,
    Cutter: 0.96,
    Yawl: 0.94,
    Schooner: 0.92,
    Ketch: 0.90
  }
  return sa*factor[rig_type];
}

function fmt(state) {
  console.log('fmt', state.values);
  return thcf(state.values);
}

const handicapForm = {
    name: "handicap",
    title: "Handicap Data",
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
          type: 'number',
          dataType: dataTypes.FLOAT,
        },

        {
          component: componentTypes.TEXT_FIELD,
          name: "handicap_data.depth",
          label: "Depth (decimal feet)",
          description: "internal depth amidships from top of keelson to a line joining the underside of the deck planking at the sides of the hull",
          type: 'number',
          dataType: dataTypes.FLOAT,
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
   const sailFields = (sides) => {
     return sides.map(({name, label}) => ({
      component: componentTypes.TEXT_FIELD,
      name,
      label: `${label} (decimal feet)`,
      type: 'number',
      dataType: dataTypes.FLOAT,
     }));
   }

const propellorForm = {
      title: "Propellor",
      name: "handicap_data.propellor",
      component: componentTypes.SUB_FORM,
      fields: [
        {
          component: componentTypes.TEXT_FIELD,
          name: "handicap_data.propellor.blades",
          label: "Blades",
          type: 'number',
          dataType: dataTypes.INTEGER,
        },
        {
          component: componentTypes.RADIO,
          name: "handicap_data.propellor.type",
          label: "propellor type",
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
      nextStep: ({ values}) => values.handicap_data.sailarea?'hull-step':'sails-step',
      fields: [
        {
          component: componentTypes.PLAIN_TEXT,
          name: 'ddf.hcintro',
          label: `This form collects the information needed to calculate a traditional T(H)CF
          handicap and the extra data for experimental and area handicaps. The calculations are a work in progress and feedback is welcome.`,
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: 'handicap_data.thcf',
          readOnly: true,
          label: 'stored T(H)CF'
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: "handicap_data.sailarea",
          label: "Sail Area (decimal square feet)",
          description: 'If you know the sail area you can enter it here',
          type: 'number',
          dataType: dataTypes.FLOAT,
        },
      ],
    },
    {
      name: "sails-step",
      nextStep: {
        when: 'rig_type',
        stepMapper: {
          Cutter:	'mainsail-step',
          Sloop: 'mainsail-step',
          cat_boat:	'mainsail-step',
          single_sail: 'mainsail-step',
          Ketch:	'mizen-step',
          Yawl:	'mizen-step',
          Schooner:	'foremast-step',
          Other:		'no-handicap-step',
          None:	'no-handicap-step',
        },
      },
      fields: [
        {
          component: componentTypes.PLAIN_TEXT,
          name: 'ddf.handicap_sails',
          label: 'Foretriangle',
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: "handicap_data.fore_triangle_height",
          label: "Height (decimal feet)",
          description: "measured from deck to the top of the highest headsail halyard sheave (for jib topsail if one can be flown)",
          type: 'number',
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: "handicap_data.fore_triangle_base",
          label: "Base (decimal feet)",
          description: "measured from the foreside of the mast to the eye of the fitting which sets the tack of the furthest forward headsail, or to the sheave of the jib outhaul at the end of the bowsprit",
          type: 'number',
          dataType: dataTypes.FLOAT,
        },        
        {
          component: componentTypes.TEXT_FIELD,
          name: 'ddf.sail_area.foretriangle',
          label: 'Calculated Area (decimal square feet)',
          description: '85% of the nominal triangle (½b×h)',
          type: 'number',
          dataType: dataTypes.FLOAT,
          isReadOnly: true,
          resolveProps: (props, {meta, input}, formOptions) => {
            const s = formOptions.getState()
            const fta = foretriangle_area(s.initialValues.handicap_data);
            formOptions.change('ddf.sail_area.foretriangle', fta);
            return { 
              value: fta
           }}
        },
      ],
    },
    {
      name: 'foremast-step',
      nextStep: 'foremast-topsail-step',
      fields: [
        {
          title: 'fore main sail',
          name: 'handicap_data.fore',
          component: componentTypes.SUB_FORM,
          condition: {
            when: 'handicap_data.fore.type',
            is: 'gaff',
          },
          fields: [sailFields([
            {name: 'handicap_data.fore.luff', label: 'Luff'},
            {name: 'handicap_data.fore.head', label: 'Head'},
            {name: 'handicap_data.fore.foot', label: 'Foot'},
          ])],
        },
        {
          title: `fore main sail`,
          name: 'handicap_data.fore',
          component: componentTypes.SUB_FORM,
          condition: {
            or: [
              {
                when: 'handicap_data.fore.type',
                is: 'bermudan',    
              },
              {
                when: 'handicap_data.fore.type',
                is: 'gunter',    
              },
            ]
          },
          fields: [sailFields([
            {name: 'handicap_data.fore.luff', label: 'Luff'},
            {name: 'handicap_data.fore.foot', label: 'Foot'},
          ])],
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: 'ddf.sail_area.fore',
          condition: {
            when: 'handicap_data.fore.type',
            is: 'gaff',
          },
          label: 'Calculated Area (decimal square feet)',
          description: '½l×f+½h×√(f²+l²)',
          type: 'number',
          dataType: dataTypes.FLOAT,
          isReadOnly: true,
          resolveProps: (props, {meta, input}, formOptions) => {
            const s = formOptions.getState()
            const sa = mainsail_area(
                s.initialValues.handicap_data.fore,
                );
            formOptions.change('ddf.sail_area.fore', sa);
            return { 
              value: sa
           }}
        },        
        {
          component: componentTypes.TEXT_FIELD,
          name: 'ddf.sail_area.fore',
          condition: {
            or: [
              {
                when: 'handicap_data.fore.type',
                is: 'bermudan',    
              },
              {
                when: 'handicap_data.fore.type',
                is: 'gunter',    
              },
            ]
          },
          label: 'Calculated Area (decimal square feet)',
          description:  '½l×f',
          type: 'number',
          dataType: dataTypes.FLOAT,
          isReadOnly: true,
          resolveProps: (props, {meta, input}, formOptions) => {
            const s = formOptions.getState()
            const sa = mainsail_area(
                s.initialValues.handicap_data.fore,
                );
            formOptions.change('ddf.sail_area.fore', sa);
            return { 
              value: sa
           }}
        },
      ]
    },
    {
      name: 'foremast-topsail-step',
      nextStep: 'mainsail-step',
      fields: [
        {    
          title: `foretopsail`,
          name: 'handicap_data.fore_topsail',
          component: componentTypes.SUB_FORM,
          fields: [sailFields([
            {name: 'handicap_data.fore_topsail.luff', label: 'Luff'},
            {name: 'handicap_data.fore_topsail.perpendicular', label: 'Perpendicular'},
          ])],
        },  
        {
          component: componentTypes.TEXT_FIELD,
          name: 'ddf.sail_area.fore_topsail',
          label: 'Calculated Area (decimal square feet)',
          description: '½l×p',
          type: 'number',
          dataType: dataTypes.FLOAT,
          isReadOnly: true,
          resolveProps: (props, {meta, input}, formOptions) => {
            const s = formOptions.getState()
            const sa = topsail_area(s.initialValues.handicap_data.fore_topsail);
            formOptions.change('ddf.sail_area.fore_topsail', sa);
            return { 
              value: sa
           }}
        },
      ]
    },
    {
      name: 'mainsail-step',
      nextStep: 'topsail-step',
      fields: [
        {    
          title: 'main sail',
          name: 'handicap_data.main',
          component: componentTypes.SUB_FORM,
          condition: {
            when: 'handicap_data.main.type',
            is: 'gaff',
          },
          fields: [sailFields([
            {name: 'handicap_data.main.luff', label: 'Luff'},
            {name: 'handicap_data.main.head', label: 'Head'},
            {name: 'handicap_data.main.foot', label: 'Foot'},
          ])],
        },
        {
          title: `main sail`,
          name: 'handicap_data.main',
          component: componentTypes.SUB_FORM,
          condition: {
            or: [
              {
                when: 'handicap_data.main.type',
                is: 'bermudan',    
              },
              {
                when: 'handicap_data.main.type',
                is: 'gunter',    
              },
            ]
          },
          fields: [sailFields([
            {name: 'handicap_data.main.luff', label: 'Luff'},
            {name: 'handicap_data.main.foot', label: 'Foot'},
          ])],
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: 'ddf.sail_area.main',
          condition: {
            when: 'handicap_data.main.type',
            is: 'gaff',
          },
          label: 'Calculated Area (decimal square feet)',
          description: '½l×f+½h×√(f²+l²)',
          type: 'number',
          dataType: dataTypes.FLOAT,
          isReadOnly: true,
          resolveProps: (props, {meta, input}, formOptions) => {
            const s = formOptions.getState()
            const sa = mainsail_area(
                s.initialValues.handicap_data.main,
                );
            formOptions.change('ddf.sail_area.main', sa);
            return { 
              value: sa
           }}
        },        
        {
          component: componentTypes.TEXT_FIELD,
          name: 'ddf.sail_area.main',
          condition: {
            or: [
              {
                when: 'handicap_data.main.type',
                is: 'bermudan',    
              },
              {
                when: 'handicap_data.main.type',
                is: 'gunter',    
              },
            ]
          },
          label: 'Calculated Area (decimal square feet)',
          description:  '½l×f',
          type: 'number',
          dataType: dataTypes.FLOAT,
          isReadOnly: true,
          resolveProps: (props, {meta, input}, formOptions) => {
            const s = formOptions.getState()
            const sa = mainsail_area(
                s.initialValues.handicap_data.main,
                );
            formOptions.change('ddf.sail_area.main', sa);
            return { 
              value: sa
           }}
        },        
      ]
    },
    {
      name: 'topsail-step',
      nextStep: 'calculated-sailarea-step',
      fields: [
        {    
          title: `topsail`,
          name: 'handicap_data.main_topsail',
          component: componentTypes.SUB_FORM,
          fields: [sailFields([
            {name: 'handicap_data.topsail.luff', label: 'Luff'},
            {name: 'handicap_data.topsail.perpendicular', label: 'Perpendicular'},
          ])],
        },  
        {
          component: componentTypes.TEXT_FIELD,
          name: 'ddf.sail_area.topsail',
          label: 'Calculated Area (decimal square feet)',
          description: '½l×p',
          type: 'number',
          dataType: dataTypes.FLOAT,
          isReadOnly: true,
          resolveProps: (props, {meta, input}, formOptions) => {
            const s = formOptions.getState()
            const sa = topsail_area(s.initialValues.handicap_data.topsail);
            formOptions.change('ddf.sail_area.topsail', sa);
            return { 
              value: sa
           }}
        },
      ]
    },  
    {
      name: 'mizen-step',
      nextStep: 'mizen-topsail-step',
      fields: [
        {
          title: 'mizen',
          name: 'handicap_data.mizen',
          component: componentTypes.SUB_FORM,
          condition: {
            when: 'handicap_data.mizen.type',
            is: 'gaff',
          },
          fields: [sailFields([
            {name: 'handicap_data.mizen.luff', label: 'Luff'},
            {name: 'handicap_data.mizen.head', label: 'Head'},
            {name: 'handicap_data.mizen.foot', label: 'Foot'},
          ])],
        },
        {
          title: `mizen`,
          name: 'handicap_data.mizen',
          component: componentTypes.SUB_FORM,
          condition: {
            or: [
              {
                when: 'handicap_data.mizen.type',
                is: 'bermudan',    
              },
              {
                when: 'handicap_data.mizen.type',
                is: 'gunter',    
              },
            ]
          },
          fields: [sailFields([
            {name: 'handicap_data.mizen.luff', label: 'Luff'},
            {name: 'handicap_data.mizen.foot', label: 'Foot'},
          ])],
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: 'ddf.sail_area.mizen',
          condition: {
            when: 'handicap_data.mizen.type',
            is: 'gaff',
          },
          label: 'Calculated Area (decimal square feet)',
          description: '½l×f+½h×√(f²+l²)',
          type: 'number',
          dataType: dataTypes.FLOAT,
          isReadOnly: true,
          resolveProps: (props, {meta, input}, formOptions) => {
            const s = formOptions.getState()
            const sa = mainsail_area(
                s.initialValues.handicap_data.mizen,
                );
            formOptions.change('ddf.sail_area.mizen', sa);
            return { 
              value: sa
           }}
        },        
        {
          component: componentTypes.TEXT_FIELD,
          name: 'ddf.sail_area.mizen',
          condition: {
            or: [
              {
                when: 'handicap_data.mizen.type',
                is: 'bermudan',    
              },
              {
                when: 'handicap_data.mizen.type',
                is: 'gunter',    
              },
            ]
          },
          label: 'Calculated Area (decimal square feet)',
          description:  '½l×f',
          type: 'number',
          dataType: dataTypes.FLOAT,
          isReadOnly: true,
          resolveProps: (props, {meta, input}, formOptions) => {
            const s = formOptions.getState()
            const sa = mainsail_area(
                s.initialValues.handicap_data.mizen,
                );
            formOptions.change('ddf.sail_area.mizen', sa);
            return {
              value: sa
           }}
        },
      ]
    },
    {
      name: 'mizen-topsail-step',
      nextStep: 'mainsail-step',
      fields: [
        {    
          title: `mizen topsail`,
          name: 'handicap_data.mizen_topsail',
          component: componentTypes.SUB_FORM,
          fields: [sailFields([
            {name: 'handicap_data.mizen_topsail.luff', label: 'Luff'},
            {name: 'handicap_data.mizen_topsail.perpendicular', label: 'Perpendicular'},
          ])],
        },  
        {
          component: componentTypes.TEXT_FIELD,
          name: 'ddf.sail_area.mizen_topsail',
          label: 'Calculated Area (decimal square feet)',
          description: '½l×p',
          type: 'number',
          dataType: dataTypes.FLOAT,
          isReadOnly: true,
          resolveProps: (props, {meta, input}, formOptions) => {
            const s = formOptions.getState()
            const sa = topsail_area(s.initialValues.handicap_data.mizen_topsail);
            formOptions.change('ddf.sail_area.mizen_topsail', sa);
            return { 
              value: sa
           }}
        },
      ]
    },
    {
      name: 'calculated-sailarea-step',
      nextStep: "hull-step",
      fields: [
        {
        component: componentTypes.TEXT_FIELD,
        name: 'calculated-sailarea',
        label: 'Calculated Sail Area',
        type: 'number',
        dataType: dataTypes.FLOAT,
        isReadOnly: true,
        resolveProps: (props, {meta, input}, formOptions) => {
          const f = formOptions.getState();
          const ddf = f.values.ddf;
          const vals = Object.keys(ddf.sail_area).map(k=>ddf.sail_area[k]);
          const sa = vals.reduce((p,v)=>p+v); 
          const rsa = Math.round(1000*sa)/1000;
          formOptions.change('handicap_data.sailarea', rsa);
          return { 
            value: rsa
         }}
        },
      ]
    },
    {
      name: 'hull-step',
      nextStep: "prop-step",
      fields: [
        {
          component: componentTypes.TEXT_FIELD,
          name: 'handicap_data.length_over_all',
          label: 'length over all (LOA) (decimal feet)',
          type: 'number',
          dataType: dataTypes.FLOAT,
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: 'handicap_data.length_on_waterline',
          label: 'waterline length (LWL) (decimal feet)',
          type: 'number',
          dataType: dataTypes.FLOAT,
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: 'handicap_data.beam',
          label: 'Beam (decimal feet)',
          type: 'number',
          dataType: dataTypes.FLOAT,
        }
      ]
    },
    {
      name: "prop-step",
      nextStep: "calc-step",
      fields: [propellorForm]
    },
    {
      name: "calc-step",
      nextStep: "done-step",
      fields: [
        {
          component: componentTypes.TEXT_FIELD,
          name: 'ddf.rig_allowance',
          isReadOnly: true,
          type: 'number',
          dataType: dataTypes.FLOAT,
          label: 'Rig allowance',
          description: 'cutter: .96, yawl: .94, schooner: .92, ketch: .90',
          resolveProps: (props, {meta, input}, formOptions) => {
            const state = formOptions.getState();
            console.log(state.values);
            const ra = rig_allowance(state.values.rig_type)
            console.log('rig_allowance', ra);
            formOptions.change('ddf.rig_allowance', ra);
            return { 
              value: ra
           }}
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: 'ddf.root_s',
          isReadOnly: true,
          type: 'number',
          dataType: dataTypes.FLOAT,
          label: 'Square root of corrected sail area',
          resolveProps: (props, {meta, input}, formOptions) => {
            const state = formOptions.getState();
            const SA = state.values.handicap_data.sailarea;
            const ra = rig_allowance(state.values.rig_type)
            const crsa = ra*Math.sqrt(SA)
            formOptions.change('ddf.root_s', crsa);
            return { 
              value: crsa
           }
          }            
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: 'ddf.c',
          isReadOnly: true,
          type: 'number',
          dataType: dataTypes.FLOAT,
          label: 'Cross section (decimal square feet)',
          description: '0.67B²',
          resolveProps: (props, {meta, input}, formOptions) => {
            const state = formOptions.getState();
            const beam =  state.initialValues.handicap_data.beam;
            const c = 0.67*beam*beam;
            formOptions.change('ddf.c', c);
            return { 
              value: c
           }}            
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: 'ddf.mr',
          label: 'Measured Rating',
          description: '0.15L(√S/√C)+0.2(L+√S)',
          type: 'number',
          dataType: dataTypes.FLOAT,
          isReadOnly: true,
          resolveProps: (props, {meta, input}, formOptions) => {
            const state = formOptions.getState();
            const LOA = state.values.handicap_data.length_over_all;
            const LWL = state.values.handicap_data.length_on_waterline;
            const L = (LOA+LWL)/2;
            const C = state.values.ddf.c;
            const rS = state.values.ddf.root_s;
            const x = 0.15*L*rS/Math.sqrt(C);
            const y = 0.2*(L+rS);    
            const mr = x + y;
            formOptions.change('ddf.mr', mr);
            return { 
              value: mr
           }}
          },        
          {
            component: componentTypes.TEXT_FIELD,
            name: 'ddf.prop_allowance',
            label: 'Prop allowance, none: 0%, folding: 1.5%, fixed: 3%',
            isReadOnly: true,
            type: 'number',
            dataType: dataTypes.FLOAT,
            resolveProps: (props, {meta, input}, formOptions) => {
              const {values} = formOptions.getState();
              let pa = 0.015;
              if(values.handicap_data.propellor.type === 'none') {
                pa = 0.0;
              }
              if(values.handicap_data.propellor.type === 'fixed') {
                pa = 0.03;
              }
              formOptions.change('ddf.prop_allowance', pa);
              return { value: pa };
            }
          },           
          {
            component: componentTypes.TEXT_FIELD,
            name: 'ddf.r',
            label: 'Final Rating ',
            type: 'number',
            dataType: dataTypes.FLOAT,
            isReadOnly: true,
            resolveProps: (props, {meta, input}, formOptions) => {
              const {values} = formOptions.getState();
              const r = values.ddf.mr - values.ddf.prop_allowance * values.ddf.mr;
              const thcf = Math.round(1000*0.125*(Math.sqrt(r)+3))/1000;
              formOptions.change('ddf.r', r);
              formOptions.change('handicap_data.thcf', thcf);              
              return { value: r }
            }
          },
          {
            component: componentTypes.TEXT_FIELD,
            name: 'handicap_data.thcf',
            label: 'T(H)CF',
            isReadOnly: true,
          },
      ]
    },
    {
      name: "no-handicap-step",
      nextStep: "done-step",
      fields: [
        {
          component: componentTypes.PLAIN_TEXT,
          name: 'ddf.no-handicap',
          label: 'we can\'t calculate a handicap for this rig type'
        }        
      ]
    }
  ];

  /*
      {
      name: "sa-step",
      nextStep: {
        when: 'ddf.collect_headsail_data',
        stepMapper: {
          yes: 'bigs-step',
          no: 'main-step',
        },
      },
      fields: [
        sailAreaForm
      ],
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
  */