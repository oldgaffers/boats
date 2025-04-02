import React from "react";
import { Typography } from "@mui/material";
import { fMR, fMSA, fPropellorBonus, fSqrtS, fThcf, rig_allowance, solentEstimatedDisplacement, solentMR, solentRating } from "../util/THCF";
import { f2m } from '../util/format';
import ConditionalText from './conditionaltext';

export function HandicapDisplay({handicapData}) {
    const checked = true; // handicapData?.checked;
    if (checked) {
      return <>
        <ConditionalText label='T(H)CF' value={handicapData.thcf?.toFixed(3)} />
        <ConditionalText label='Solent Rating' value={handicapData.solent?.thcf?.toFixed(3)} />
      </>;
    }
    return <>
     <Typography variant='subtitle2' component='span'>T(H)CF: </Typography>
     <Typography variant="body1" component='span'>
        We are asking all boat owners to re-validate the data used to calculate handicaps.
        The best way to do this is to use the 'I have Edits' button and step through the choices,
        making any changes you want. If all is correct, just submit the form. Alternatively, email
        the boat register editors.
      </Typography>
    </>;
}

export const solentSteps = (thisStep, nextStep) => {
  return [
    {
      name: thisStep,
      title: 'Solent Rating',
      nextStep: 'performance-factor-step',
      fields: [
        {
          component: 'plain-text',
          name: 'solent-rating-narrative',
          label: <span><em>Solent Rating</em> is a modified T(H)CF handicap rating designed to
            represent the displacement of a wider range of vessels more accurately than the traditional
            OGA rating. It uses the best data available for each boat. Where no data is available an approximation
            is calculated based on hull shape.
          </span>,
        },
        {
          component: 'text-field',
          name: "handicap_data.displacement",
          label: 'Displacement (kg)',
          helperText: <>Enter the weight of the boat in kg as raced.
            If you have it in tonnes, multiply by 1000. If you don't have a value for your boat, but
            you have a value for the design class, enter that figure.
            If you don't have a number, leave this field blank.</>,
          type: "number",
          dataType: 'float',
          isRequired: false,
        },
        {
          component: 'radio',
          name: "handicap_data.solent.hull_shape",
          label: 'Select the most appropriate hull shape',
          helperText: `In most cases you should leave this on the default setting.
            This value is ignored if you enter a displacement value above.`,
          initialValue: 'Long keel - Standard',
          options: [
            {
              label: "Long keel High volume (e.g. an East Coast Smack)",
              value: "Long keel - High volume",
            },
            {
              label: "Long keel Standard (e.g. a Falmouth Working Boat)",
              value: "Long keel - Standard",
            },
            {
              label: "Long keel Low volume (e.g. Memory 19)",
              value: "Long keel - Low volume",
            },
            { label: "Fin keel", value: "Fin keel (e.g. Kelpie II)" },
          ],
        },
        {
          component: 'text-field',
          name: "ddf.solent.length",
          label: 'length (m)',
          description: '½(LOD+LWL)',
          hideField: true,
          resolveProps: (props, { meta, input }, formOptions) => {
            const { values } = formOptions.getState();
            const LOD = values.handicap_data.length_on_deck || 0.0;
            const LWL = values.handicap_data.length_on_waterline || 0.0;
            const L = f2m((LOD + LWL) / 2);
            return {
              value: L,
            };
          }
        },
        {
          component: 'text-field',
          name: "ddf.solent.beam",
          label: 'beam (m)',
          hideField: true,
          resolveProps: (props, { meta, input }, formOptions) => {
            const { values } = formOptions.getState();
            const B = f2m(values.handicap_data.beam);
            return {
              value: B,
            };
          }
        }, {
          component: 'text-field',
          name: "ddf.solent.draft",
          label: 'draft (m)',
          hideField: true,
          resolveProps: (props, { meta, input }, formOptions) => {
            const { values } = formOptions.getState();
            const D = f2m(values.handicap_data.draft);
            return {
              value: D,
            };
          }
        },
      ],
    },
    {
      name: 'performance-factor-step',
      nextStep: 'solent-rating-step',
      title: 'Performance Factor',
      fields: [
        {
          component: 'plain-text',
          name: 'ddf.solent.narrative',
          label: <>The <em>Solent Rating</em> is intended to be as fair as possible across
            a huge range of boats, from heavy displacement cruisers to light-weight dayboats.
            Ratings for boats with high performance features may need to be adjusted to make
            racing fair for everyone. Please describe anything you think might be relevant.
            Examples might include carbon fibre spars or mainsail luff tracks.
            The Handicap committee will review all ratings and advise if any adjustment needs
            to be made</>
        },
        {
          component: 'textarea',
          name: 'handicap_data.peformance_details',
          label: 'High performance features',
          helperText: 'Describe anything relevant.',
          minRows: 2,
          maxRows: 10,
          onKeyDown: (e) => {
            if (e.key === 'Enter') {
              e.stopPropagation();
            }
          }
        },
      ]
    },
    {
      name: 'solent-rating-step',
      nextStep,
      title: 'Solent Rating Summary',
      fields: [
        {
          component: 'plain-text',
          name: 'ddf.shds',
          label: 'Solent Rating Summary'
        },
        {
          component: 'text-field',
          name: "ddf.effective_displacement",
          label: "Effective Displacement (kg)",
          isReadOnly: true,
          resolveProps: (props, { meta, input }, formOptions) => {
            const { values } = formOptions.getState();
            const displacement = values?.handicap_data?.displacement;            
            if (displacement && !Number.isNaN(displacement)) {
              formOptions.change("ddf.effective_displacement", displacement);
              return {
                value: displacement,
                description: "entered displacement",
              };
            } else {
              const disp = solentEstimatedDisplacement(values?.handicap_data);
              formOptions.change("ddf.effective_displacement", disp);
              return {
                value: disp,
                description: "½(LOD+LWL)⨉B⨉D⨉SF⨉1000",
              };
            }
          },
        },
        {
          component: 'text-field',
          name: "ddf.performance_factor",
          label: "% performance factor",
          isReadOnly: true,
          description: 'A value determined by the handicap committee',
          resolveProps: (props, { meta, input }, formOptions) => {
            const { values } = formOptions.getState();
            const value = values?.handicap_data?.solent?.performance_factor || 0;
            return {
              value: `${100*value}%`,
            }
          },
        },
        {
          component: 'text-field',
          name: "handicap_data.solent.measured_rating",
          label: "Modified Measured Rating (m)",
          isReadOnly: true,
          resolveProps: (props, { meta, input }, formOptions) => {
            const { values } = formOptions.getState();
            const mmr = solentMR(values);
            formOptions.change("handicap_data.solent.measured_rating", mmr);
            if (values?.handicap_data?.displacement) {
              return {
                value: mmr.toFixed(2),
                description: '0.2L√S/√(Disp/L)+0.67*(L+√S)',
              };
            } else {
              return {
                value: mmr.toFixed(2),
                description: '0.2L√S/√(B×D×SF)+0.67*(L+√S)',
              };
            }
          },
        },
        {
          component: 'text-field',
          name: "handicap_data.solent.thcf",
          label: "Solent Rating T(H)CF",
          isReadOnly: true,
          resolveProps: (props, { meta, input }, formOptions) => {
            const { values } = formOptions.getState();
            const mthcf = solentRating(values);
            formOptions.change('handicap_data.solent.thcf', mthcf);
            return { value: mthcf };
          },
        },
        {
          component: 'checkbox',
          name: 'ddf.playground',
          label: 'check to see the effect of performance factor on T(H)CF',
          initialValue: false,
        },
        {
          component: 'radio',
          name: "ddf.spf",
          label: "Performance factor playground",
          helperText: `
            You can put a value in here and see what the effect would be.
            The value here won't be saved.
          `,
          initialValue: 0.00,
          isRequired: false,
          options: [
            { label: '0%', value: 0.00 },
            { label: '1%', value: 0.01 },
            { label: '2%', value: 0.02 },
            { label: '3%', value: 0.03 },
            { label: '4%', value: 0.04 },
            { label: '5%', value: 0.05 },
          ],
          condition: {
            when: 'ddf.playground',
            is: true,
          },
        },
        {
          component: 'text-field',
          name: "ddf.mthcf",
          isReadOnly: true,
          resolveProps: (props, { meta, input }, formOptions) => {
            const { values } = formOptions.getState();
            const v = JSON.parse(JSON.stringify(values)); // deep copy
            const spf = v.ddf?.spf || 0.0;
            v.handicap_data.solent.performance_factor = spf;
            const mthcf = solentRating(v);
            formOptions.change('ddf.mthcf', mthcf);
            return {
              value: mthcf,
              label: `Solent Rating with a performance factor of ${100 * spf}% `,
            };
          },
          condition: {
            when: 'ddf.playground',
            is: true,
          },
        },
        {
          component: 'text-field',
          name: "handicap_data.thcf",
          label: "T(H)CF",
          isReadOnly: true,
        },
        {
          component: 'text-field',
          name: "ddf.diff",
          label: "Difference",
          type: "string",
          isReadOnly: true,
          resolveProps: (props, { meta, input }, formOptions) => {
            const { values } = formOptions.getState();
            const mthcf = values.ddf.mthcf || values.handicap_data.solent.thcf;
            const diff = Math.abs(mthcf - values.handicap_data.thcf);
            const v = 100 * diff / values.handicap_data.thcf;
            formOptions.change('ddf.diff', v);
            return {
              value: `${v.toFixed(1)}%`,
            };
          },
        },
        
      ],
    },
  ];
}

export function foretriangle_area({
  fore_triangle_height,
  fore_triangle_base,
}) {
  if (fore_triangle_height && fore_triangle_base) {
    return Math.round(1000 * 0.85 * 0.5 * fore_triangle_height * fore_triangle_base) / 1000;
  }
  return 0;
}

export function mainsail_area(sail) {
  if (sail) {
    if (sail.head) {
      const { luff, head, foot } = sail;
      if (luff && head && foot) {
        return 0.5 * luff * foot + 0.5 * head * Math.sqrt(foot * foot + luff * luff);
      }
    } else {
      if (sail.luff && sail.foot) {
        return 0.5 * sail.luff * sail.foot;
      }
    }
  }
  return 0;
}

export function topsail_area(sail) {
  if (sail) {
    if (sail.luff && sail.perpendicular) {
      return 0.5 * sail.luff * sail.perpendicular;
    }
  }
  return 0;
}

export function sail_area({ values }) {
  let total = foretriangle_area(values.handicap_data);
  total += mainsail_area(values.mainsail_type, values.handicap_data.main);
  total += topsail_area(values.handicap_data.topsail);
  if (values.rig_type === "Schooner") {
    total += mainsail_area(values.mainsail_type, values.handicap_data.fore);
    total += topsail_area(values.handicap_data.fore_topsail);
  }
  if (["Ketch", "Yawl"].includes(values.rig_type)) {
    total += mainsail_area(values.mainsail_type, values.handicap_data.mizzen);
    total += topsail_area(values.handicap_data.mizzen_topsail);
  }
  return total;
}

const sailFields = (sides) => {
  return sides.map(({ name, label }) => ({
    component: 'text-field',
    name,
    label: `${label} (decimal feet)`,
    type: "number",
    dataType: 'float',
  }));
};

const propellorForm = {
  title: "Propellor",
  name: "handicap_data.propellor",
  component: 'sub-form',
  fields: [
    {
      component: 'text-field',
      name: "handicap_data.propellor.blades",
      label: "Blades",
      type: "number",
      dataType: 'integer',
    },
    {
      component: 'radio',
      name: "handicap_data.propellor.type",
      label: "propellor type",
      options: [
        { label: "None", value: "none" },
        { label: "Folding (1.5%)", value: "folding" },
        { label: "Feathering (1.5%)", value: "feathering" },
        { label: "Fixed (3%)", value: "fixed" },
      ],
      isRequired: true,
      validate: [{ type: 'required' }],
    },
  ],
};

const headsail = (name, nextStep) => {
  return {
    name: `${name}-step`,
    component: 'sub-form',
    nextStep,
    fields: [
      {
        title: name.replace(/_/g, " "),
        name: `handicap_data.${name}`,
        component: 'sub-form',
        fields: [
          sailFields([
            { name: `handicap_data.${name}.luff`, label: "Luff" },
            { name: `handicap_data.${name}.leech`, label: "Leech" },
            { name: `handicap_data.${name}.foot`, label: "Foot" },
          ]),
        ],
      },
    ],
  };
};

const main_required_props = (sail, rig_type, dimension) => {
  const required_fields = {
    isRequired: true,
    validate: [{ type: 'required' }],
  };
  if (sail === "main") return required_fields;
  switch (rig_type) {
    case "Yawl":
    case "Ketch":
      if (sail === "mizzen") {
        if (dimension === 'head') {
          return { isRequired: false };
        }
        return required_fields;
      }
      break;
    case "Schooner":
      if (sail === "fore") return required_fields;
      break;
    default:
      return { isRequired: false };
  }
};

const mainsail_fields = (sail) => {
  return [
    {
      component: 'plain-text',
      name: `ddf.${sail}.intro`,
      label: `${sail} sail`,
    },
    {
      component: 'text-field',
      name: `handicap_data.${sail}.luff`,
      label: `Luff (decimal feet)`,
      type: "number",
      dataType: 'float',
      resolveProps: (props, { meta, input }, formOptions) => {
        const s = formOptions.getState();
        return main_required_props(sail, s.values.rig_type);
      },
    },
    {
      component: 'text-field',
      name: `handicap_data.${sail}.foot`,
      label: `Foot (decimal feet)`,
      type: "number",
      dataType: 'float',
      resolveProps: (props, { meta, input }, formOptions) => {
        const s = formOptions.getState();
        return main_required_props(sail, s.values.rig_type);
      },
    },
    {
      component: 'text-field',
      name: `handicap_data.${sail}.head`,
      label: `Head (decimal feet)`,
      type: "number",
      dataType: 'float',
      condition: {
        and: [
          { not: { when: () => `${sail}sail_type`, is: "bermudan" } },
          { not: { when: () => `${sail}sail_type`, is: "gunter" } },
          { not: { when: () => `${sail}sail_type`, is: "legomutton" } },
        ],
      },
      resolveProps: (props, { meta, input }, formOptions) => {
        const s = formOptions.getState();
        return main_required_props(sail, s.values.rig_type, 'head');
      },
    },
    {
      component: 'text-field',
      name: `ddf.sail_area.${sail}`,
      label: "Calculated Area (decimal square feet)",
      isReadOnly: true,
      resolveProps: (props, { meta, input }, formOptions) => {
        const s = formOptions.getState();
        const hd = s.values.handicap_data;
        if (hd) {
          const saildata = hd[sail];
          if (saildata) {
            const sa = Math.round(1000 * mainsail_area(saildata)) / 1000;
            formOptions.change(`ddf.sail_area.${sail}`, sa);
            return {
              value: sa,
              description: saildata.head ? "½l×f+½h×√(f²+l²)" : "½l×f",
            }
          }
          return {
            description: (sail === 'main') ? "½l×f+½h×√(f²+l²)" : "½l×f",
          }
        }
      },
    },
  ];
};

const topsail_fields = (sail) => [
  {
    component: 'plain-text',
    name: `ddf.${sail}`,
    label: sail,
  },
  {
    component: 'text-field',
    name: `handicap_data.${sail}.luff`,
    label: `Luff (decimal feet)`,
    type: "number",
    dataType: 'float',
  },
  {
    component: 'text-field',
    name: `handicap_data.${sail}.perpendicular`,
    label: `Perpendicular (decimal feet)`,
    type: "number",
    dataType: 'float',
  },
  {
    component: 'text-field',
    name: `ddf.sail_area.${sail}`,
    label: "Calculated Area (decimal square feet)",
    description: "½l×p",
    isReadOnly: true,
    resolveProps: (props, { meta, input }, formOptions) => {
      let sa = 0;
      const s = formOptions.getState();
      const hd = s.values.handicap_data;
      if (hd) {
        sa = Math.round(1000 * topsail_area(hd[sail])) / 1000;
        formOptions.change(`ddf.sail_area.${sail}`, sa);
      }
      return {
        value: sa,
      };
    },
  },
];

export const steps = (firstStep, nextStep) => [
  {
    name: firstStep,
    nextStep: ({ values }) => values.ddf.use_sailarea ? "handicap-hull-step" : "foretriangle-step",
    fields: [
      {
        title: "Handicap Details",
        name: 'ddf.hcd',
        component: 'sub-form',
        description: `The following steps collect the information needed to calculate a traditional T(H)CF
        handicap and the extra data for experimental and area handicaps.`,
        fields: [
          {
            component: 'text-field',
            name: "handicap_data.thcf",
            readOnly: true,
            label: "stored T(H)CF",
          },
          {
            component: 'text-field',
            name: "handicap_data.sailarea",
            label: "Sail Area (decimal square feet)",
            description: "If you know the sail area you can enter it here",
            type: "number",
            dataType: 'float',
          },
          {
            component: 'checkbox',
            name: "ddf.use_sailarea",
            label: "Use the sail area",
            description: "skip entering fore-triangle and sail measurements",
            initialValue: false,
            resolveProps: (props, { meta, input }, formOptions) => {
              const f = formOptions.getState();
              const handicap_data = f.values.handicap_data;
              return {
                isDisabled: !handicap_data.sailarea,
              };
            },
          },
        ],
      },
    ],
  },
  {
    name: "foretriangle-step",
    component: 'sub-form',
    nextStep: {
      when: "rig_type",
      stepMapper: {
        Cutter: "mainsail-step",
        Sloop: "mainsail-step",
        Ketch: "mainsail-step",
        Yawl: "mainsail-step",
        'Single Sail': "mainsail-step",
        'Cat Boat': "mainsail-step",
        Other: "mainsail-step",
        Schooner: "foremast-step",
      },
    },
    fields: [
      {
        component: 'plain-text',
        name: "ddf.handicap_sails",
        label: "Foretriangle",
      },
      {
        component: 'text-field',
        name: "handicap_data.fore_triangle_height",
        label: "Height (decimal feet)",
        description:
          "measured from deck to the top of the highest headsail halyard sheave (for jib topsail if one can be flown)",
        type: "number",
        isRequired: true,
        validate: [{ type: 'required' }],
      },
      {
        component: 'text-field',
        name: "handicap_data.fore_triangle_base",
        label: "Base (decimal feet)",
        description:
          "measured from the foreside of the mast to the eye of the fitting which sets the tack of the furthest forward headsail, or to the sheave of the jib outhaul at the end of the bowsprit. If you have no foresails enter 0.",
        type: "number",
        isRequired: true,
        validate: [{ type: 'required' }],
      },
      {
        component: 'text-field',
        name: "ddf.sail_area.foretriangle",
        label: "Calculated Area (decimal square feet)",
        description: "85% of the nominal fore-triangle (½b×h)",
        type: "number",
        dataType: 'float',
        isReadOnly: true,
        resolveProps: (props, { meta, input }, formOptions) => {
          const f = formOptions.getState();
          const handicap_data = f.values.handicap_data;
          const sa = foretriangle_area(handicap_data);
          formOptions.change('ddf.sail_area.foretriangle', sa);
          if (handicap_data) {
            return {
              value: sa,
            };
          }
        },
      },
    ],
  },
  {
    title: "Fore main sail",
    name: "foremast-step",
    component: 'sub-form',
    nextStep: "foremast-topsail-step",
    fields: mainsail_fields("fore"),
  },
  {
    title: "foremast topsail",
    name: "foremast-topsail-step",
    component: 'sub-form',
    nextStep: "mainsail-step",
    fields: topsail_fields("fore_topsail"),
  },
  {
    title: "Main sail",
    name: "mainsail-step",
    component: 'sub-form',
    nextStep: {
      when: "rig_type",
      stepMapper: {
        Cutter: "topsail-step",
        Sloop: "topsail-step",
        'Cat Boat': "calculated-sailarea-step",
        'Single Sail': "calculated-sailarea-step",
        Ketch: "topsail-step",
        Yawl: "topsail-step",
        Schooner: "topsail-step",
        Other: "no-handicap-step",
        None: "no-handicap-step",
      },
    },
    fields: mainsail_fields("main"),
  },
  {
    name: "topsail-step",
    component: 'sub-form',
    nextStep: {
      when: "rig_type",
      stepMapper: {
        Cutter: "calculated-sailarea-step",
        Sloop: "calculated-sailarea-step",
        'Cat Boat': "calculated-sailarea-step",
        'Single Sail': "calculated-sailarea-step",
        Ketch: "mizzen-step",
        Yawl: "mizzen-step",
        Schooner: "calculated-sailarea-step",
        Other: "no-handicap-step",
        None: "no-handicap-step",
      },
    },
    fields: topsail_fields("topsail"),
  },
  {
    title: "Mizzen main sail",
    name: "mizzen-step",
    component: 'sub-form',
    nextStep: "mizzen-topsail-step",
    fields: mainsail_fields("mizzen"),
  },
  {
    title: "Mizzen topsail",
    name: "mizzen-topsail-step",
    component: 'sub-form',
    nextStep: 'calculated-sailarea-step',
    fields: topsail_fields("mizzen_topsail"),
  },
  {
    name: "calculated-sailarea-step",
    component: 'sub-form',
    nextStep: 'handicap-hull-step',
    fields: [
      {
        component: 'text-field',
        name: "ddf.total_sailarea",
        label: "Calculated Sail Area",
        isReadOnly: true,
        resolveProps: (props, { meta, input }, formOptions) => {
          const f = formOptions.getState();
          // const ddf = f.values.ddf;
          // const vals = Object.keys(ddf.sail_area).map((k) => ddf.sail_area[k]);
          // const sa = vals.reduce((p, v) => p + v);
          const sa = fMSA(f.values.ddf.sail_area);
          const rsa = Math.round(1000 * sa) / 1000;
          formOptions.change('ddf.total_sailarea', sa);
          return {
            value: rsa,
          };
        },
      },
    ],
  },
  {
    name: "handicap-hull-step",
    component: 'sub-form',
    nextStep: 'prop-step',
    fields: [
      {
        component: 'text-field',
        name: "handicap_data.length_on_deck",
        label: "length on deck (LOD) (decimal feet)",
        type: "number",
        dataType: 'float',
        isRequired: true,
        validate: [{ type: 'required' }],
      },
      {
        component: 'text-field',
        name: "handicap_data.length_on_waterline",
        label: "waterline length (LWL) (decimal feet)",
        type: "number",
        dataType: 'float',
        isRequired: true,
        validate: [{ type: 'required' }],
      },
      {
        component: 'text-field',
        name: "handicap_data.beam",
        label: "Beam (decimal feet)",
        type: "number",
        dataType: 'float',
        isRequired: true,
        validate: [{ type: 'required' }],
      },
    ],
  },
  {
    name: "prop-step",
    component: 'sub-form',
    nextStep: "calc-step",
    fields: [propellorForm],
  },
  {
    name: "calc-step",
    component: 'sub-form',
    title: 'Summary',
    nextStep: 'handicap-options-step',
    fields: [
      {
        component: 'plain-text',
        name: 'ddf.hds',
        label: 'T(H)CF Summary'
      },
      {
        component: 'text-field',
        name: "ddf.rig_allowance",
        isReadOnly: true,
        label: "Rig allowance",
        description: "cutter: .96, yawl: .94, schooner: .92, ketch: .90",
        resolveProps: (props, { meta, input }, formOptions) => {
          const { values } = formOptions.getState();
          const ra = rig_allowance(values.rig_type);
          formOptions.change("ddf.rig_allowance", ra);
          return {
            value: ra.toFixed(2),
          };
        },
      },
      {
        component: 'text-field',
        name: "ddf.root_s",
        isReadOnly: true,
        label: "Square root of corrected sail area",
        resolveProps: (props, { meta, input }, formOptions) => {
          const { values } = formOptions.getState();
          const { ddf, handicap_data } = values;
          const crsa = fSqrtS(
            ddf.rig_allowance,
            ddf.use_sailarea ? handicap_data.sailarea : ddf.total_sailarea,
          );
          formOptions.change("ddf.root_s", crsa);
          return {
            value: crsa.toFixed(2),
          };
        },
      },
      {
        component: 'text-field',
        name: "ddf.c",
        isReadOnly: true,
        label: "Cross section (decimal square feet)",
        description: "0.67B²",
        resolveProps: (props, { meta, input }, formOptions) => {
          const { values } = formOptions.getState();
          const hd = values.handicap_data;
          let c = 0;
          if (hd) {
            c = 0.67 * hd.beam * hd.beam;
            formOptions.change("ddf.c", c);
          }
          return {
            value: c.toFixed(2),
          };
        },
      },
      {
        component: 'text-field',
        name: "ddf.mr",
        label: "Measured Rating",
        description: "0.15L(√S/√C)+0.2(L+√S)",
        isReadOnly: true,
        resolveProps: (props, { meta, input }, formOptions) => {
          const { values } = formOptions.getState();
          const mr = Math.round(1000 * fMR(values)) / 1000;
          formOptions.change("ddf.mr", mr);
          return {
            value: mr,
          };
        },
      },
      {
        component: 'text-field',
        name: "ddf.prop_allowance",
        label: "Prop allowance, none: 0%, folding/feathering: 1.5%, fixed: 3%",
        isReadOnly: true,
        resolveProps: (props, { meta, input }, formOptions) => {
          const { values } = formOptions.getState();
          const pa = fPropellorBonus(values.handicap_data);
          formOptions.change("ddf.prop_allowance", pa);
          return { value: `${(100 * pa).toFixed(1)}%` };
        },
      },
      {
        component: 'text-field',
        name: "ddf.r",
        label: "Final Rating ",
        isReadOnly: true,
        resolveProps: (props, { meta, input }, formOptions) => {
          const { values } = formOptions.getState();
          const r = Math.round(1000 * values.ddf.mr * (1 - values.ddf.prop_allowance)) / 1000;
          formOptions.change("ddf.r", r);
          return { value: r };
        },
      },
      {
        component: 'text-field',
        name: "handicap_data.thcf",
        label: "T(H)CF",
        isReadOnly: true,
        resolveProps: (props, { meta, input }, formOptions) => {
          const { values } = formOptions.getState();
          const thcf = Math.round(1000 * fThcf(values.ddf.r)) / 1000;
          console.log('HC', handicap_data.thcf, 'to', thcf);
          formOptions.change("handicap_data.thcf", thcf);
          return { value: thcf };
        },
      },
    ],
  },
  {
    name: 'handicap-options-step',
    component: 'sub-form',
    nextStep: {
      when: "ddf.handicap_options",
      stepMapper: {
        1: "biggest_staysail-step",
        2: "displacement-step",
        3: "biggest_staysail-step",
        4: nextStep,
      },
    },
    fields: [
      {
        component: 'plain-text',
        name: 'ddf.ashcol',
        label: 'What Next?'
      },
      {
        component: 'radio',
        name: "ddf.handicap_options",
        label: "Additional Handicap Data",
        initialValue: 4,
        options: [
          { label: "Add racing headsails (e.g. for the East Coast Race)", value: 1 },
          { label: <span>Get a <em>Solent Rating</em> (required for Solent Area races)</span>, value: 2 },
          { label: "Add both racing headsails and get a Solent Rating", value: 3 },
          { label: "I don't need either", value: 4 },
        ],
      },
    ]
  },
  headsail("biggest_staysail", "biggest_jib-step"),
  headsail("biggest_jib", "biggest_downwind_sail-step"),
  headsail("biggest_downwind_sail", "east-coast-calc-step"),
  {
    name: 'east-coast-calc-step',
    component: 'sub-form',
    label: 'EC Handicap Done',
    nextStep: {
      when: "ddf.handicap_options",
      stepMapper: {
        1: nextStep,
        2: "displacement-step",
        3: "displacement-step",
        4: nextStep,
      },
    },
    fields: [
      {
        component: 'plain-text',
        name: "ddf.east-coast-done",
        label: `That's all the headsails.
        We don't have the calculations implemented for this yet, but the
        values are stored in the register and will be used by the race organisers.`
      }
    ],
  },
  ...solentSteps('displacement-step', nextStep),
  {
    name: "no-handicap-step",
    component: 'sub-form',
    nextStep,
    fields: [
      {
        component: 'plain-text',
        name: "ddf.no-handicap",
        label: "we can't calculate a handicap for this rig type",
      },
    ],
  },
];
