import { rig_allowance } from "../util/THCF";
import { solentFields } from "./ddf/SubForms";

export function foretriangle_area({
  fore_triangle_height,
  fore_triangle_base,
}) {
  if (fore_triangle_height && fore_triangle_base) {
    return 0.85 * 0.5 * fore_triangle_height * fore_triangle_base;
  }
  return 0;
}

export function mainsail_area(sail) {
  if (sail) {
    if (sail.head) {
      const { luff, head, foot } = sail;
      if (luff && head && foot) {
        return (
          0.5 * luff * foot + 0.5 * head * Math.sqrt(foot * foot + luff * luff)
        );
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
        { label: "Fixed", value: "fixed" },
        { label: "Folding", value: "folding" },
        { label: "Feathering", value: "feathering" },
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

const main_required_props = (sail, rig_type) => {
  const required_fields = {
    isRequired: true,
    validate: [{ type: 'required' }],
  };
  if (sail === "main") return required_fields;
  switch (rig_type) {
    case "Yawl":
    case "Ketch":
      if (sail === "mizzen") return required_fields;
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
        const hd = s.values.handicap_data;
        if (hd) {
          formOptions.change(`ddf.sail_area.${sail}`, mainsail_area(hd[sail]));
        }
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
        const hd = s.values.handicap_data;
        if (hd) {
          formOptions.change(`ddf.sail_area.${sail}`, mainsail_area(hd[sail]));
        }
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
        const hd = s.values.handicap_data;
        if (hd) {
          formOptions.change(`ddf.sail_area.${sail}`, mainsail_area(hd[sail]));
        }
        return main_required_props(sail, s.values.rig_type);
      },
    },
    {
      component: 'text-field',
      name: `ddf.sail_area.${sail}`,
      label: "Calculated Area (decimal square feet)",
      type: "number",
      dataType: 'float',
      isReadOnly: true,
      resolveProps: (props, { meta, input }, formOptions) => {
        const r = { description: "½l×f" };
        const s = formOptions.getState();
        const hd = s.values.handicap_data;
        if (hd) {
          r.value = mainsail_area(hd[sail]);
          if (hd[sail] && hd[sail].head) {
            r.description = "½l×f+½h×√(f²+l²)";
          }
        }
        return r;
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
    resolveProps: (props, { meta, input }, formOptions) => {
      const s = formOptions.getState();
      const hd = s.values.handicap_data;
      if (hd && hd[sail]) {
        formOptions.change(`ddf.sail_area.${sail}`, topsail_area(hd[sail]));
      }
    },
  },
  {
    component: 'text-field',
    name: `handicap_data.${sail}.perpendicular`,
    label: `Perpendicular (decimal feet)`,
    type: "number",
    dataType: 'float',
    resolveProps: (props, { meta, input }, formOptions) => {
      const s = formOptions.getState();
      const hd = s.values.handicap_data;
      if (hd && hd[sail]) {
        formOptions.change(`ddf.sail_area.${sail}`, topsail_area(hd[sail]));
      }
    },
  },
  {
    component: 'text-field',
    name: `ddf.sail_area.${sail}`,
    label: "Calculated Area (decimal square feet)",
    description: "½l×p",
    type: "number",
    dataType: 'float',
    isReadOnly: true,
    initialValue: 0,
    resolveProps: (props, { meta, input }, formOptions) => {
      let sa = 0;
      const s = formOptions.getState();
      const hd = s.values.handicap_data;
      if (hd) {
        sa = topsail_area(hd[sail]);
        formOptions.change(`ddf.sail_area.${sail}`, sa);
      }
      return {
        value: sa,
      };
    },
  },
];

export const steps = (nextStep) => [
  {
    name: "handicap-step",
    component: 'sub-form',
    nextStep: ({ values }) => {
      if(values.handicap_data && values.handicap_data.sailarea) {
        return 'hull-step'
      }
      if(['Cat Boat','Single Sail'].includes(values.rig_type)) {
        return 'mainsail-step';
      }
      if(['None'].includes(values.rig_type)) {
        return 'no-handicap-step';
      }
      return "sails-step";
    },
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
        ],
      },
    ],
  },
  {
    name: "sails-step",
    component: 'sub-form',
    nextStep: {
      when: "rig_type",
      stepMapper: {
        Cutter: "mainsail-step",
        Sloop: "mainsail-step",
        'Cat Boat': "mainsail-step",
        'Single Sail': "mainsail-step",
        Ketch: "mainsail-step",
        Yawl: "mainsail-step",
        Schooner: "foremast-step",
        Other: "no-handicap-step",
        None: "no-handicap-step",
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
        resolveProps: (props, { meta, input }, formOptions) => {
          const s = formOptions.getState();
          const handicap_data = s.values.handicap_data;
          if (handicap_data) {
            const fta = foretriangle_area(handicap_data);
            formOptions.change("ddf.sail_area.foretriangle", fta);
          }
          switch (s.values.rig_type) {
            case "Cutter":
            case "Sloop":
            case "Ketch":
            case "Yawl":
            case "Schooner":
              return {
                isRequired: true,
                validate: [{ type: 'required' }],
              };
            default:
              return {
                isRequired: false,
              };
          }
        },
      },
      {
        component: 'text-field',
        name: "handicap_data.fore_triangle_base",
        label: "Base (decimal feet)",
        description:
          "measured from the foreside of the mast to the eye of the fitting which sets the tack of the furthest forward headsail, or to the sheave of the jib outhaul at the end of the bowsprit",
        type: "number",
        dataType: 'float',
        resolveProps: (props, { meta, input }, formOptions) => {
          const s = formOptions.getState();
          const handicap_data = s.values.handicap_data;
          if (handicap_data) {
            const fta = foretriangle_area(handicap_data);
            formOptions.change("ddf.sail_area.foretriangle", fta);
          }
          switch (s.values.rig_type) {
            case "Cutter":
            case "Sloop":
            case "Ketch":
            case "Yawl":
            case "Schooner":
              return {
                isRequired: true,
                validate: [{ type: 'required' }],
              };
            default:
              return {
                isRequired: false,
              };
          }
        },
      },
      {
        component: 'text-field',
        name: "ddf.sail_area.foretriangle",
        label: "Calculated Area (decimal square feet)",
        description: "85% of the nominal triangle (½b×h)",
        type: "number",
        dataType: 'float',
        isReadOnly: true,
        initialValue: 0,
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
    nextStep: "calculated-sailarea-step",
    fields: topsail_fields("mizzen_topsail"),
  },
  {
    name: "calculated-sailarea-step",
    component: 'sub-form',
    nextStep: "hull-step",
    fields: [
      {
        component: 'text-field',
        name: "ddf.calculated-sailarea",
        label: "Calculated Sail Area",
        type: "number",
        dataType: 'float',
        isReadOnly: true,
        resolveProps: (props, { meta, input }, formOptions) => {
          const f = formOptions.getState();
          const ddf = f.values.ddf;
          const vals = Object.keys(ddf.sail_area).map((k) => ddf.sail_area[k]);
          const sa = vals.reduce((p, v) => p + v);
          const rsa = Math.round(1000 * sa) / 1000;
          formOptions.change("handicap_data.sailarea", rsa);
          return {
            value: rsa,
          };
        },
      },
    ],
  },
  {
    name: "hull-step",
    component: 'sub-form',
    nextStep: "prop-step",
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
        label: "Beam (decimal feet) (measured on the waterline)",
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
    nextStep: 'hull-shape-step',
    fields: [propellorForm],
  },
  solentFields('hull-shape-step', 'calc-step'),
  {
    name: "calc-step",
    component: 'sub-form',
    nextStep: ({ values }) =>
      values.ddf.east_coast ? "biggest_staysail-step" : "done-step",
    fields: [
      {
        component: 'text-field',
        name: "ddf.rig_allowance",
        isReadOnly: true,
        type: "number",
        dataType: 'float',
        label: "Rig allowance",
        description: "cutter: .96, yawl: .94, schooner: .92, ketch: .90",
        resolveProps: (props, { meta, input }, formOptions) => {
          const { values } = formOptions.getState();
          const ra = rig_allowance(values.rig_type);
          formOptions.change("ddf.rig_allowance", ra);
          return {
            value: ra,
          };
        },
      },
      {
        component: 'text-field',
        name: "ddf.root_s",
        isReadOnly: true,
        type: "number",
        dataType: 'float',
        label: "Square root of corrected sail area",
        resolveProps: (props, { meta, input }, formOptions) => {
          const { values } = formOptions.getState();
          const SA = values.handicap_data.sailarea;
          const ra = rig_allowance(values.rig_type);
          const crsa = ra * Math.sqrt(SA);
          formOptions.change("ddf.root_s", crsa);
          return {
            value: crsa,
          };
        },
      },
      {
        component: 'text-field',
        name: "ddf.c",
        isReadOnly: true,
        type: "number",
        dataType: 'float',
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
            value: c,
          };
        },
      },
      {
        component: 'text-field',
        name: "ddf.mr",
        label: "Measured Rating",
        description: "0.15L(√S/√C)+0.2(L+√S)",
        type: "number",
        dataType: 'float',
        isReadOnly: true,
        resolveProps: (props, { meta, input }, formOptions) => {
          const { values } = formOptions.getState();
          const LOD = values.handicap_data.length_on_deck || 0.0;
          const LWL = values.handicap_data.length_on_waterline || 0.0;
          const L = (LOD + LWL) / 2;
          const C = values.ddf.c;
          const rS = values.ddf.root_s;
          const x = (0.15 * L * rS) / Math.sqrt(C);
          const y = 0.2 * (L + rS);
          const mr = x + y;
          formOptions.change("ddf.mr", mr);
          return {
            value: mr,
          };
        },
      },
      {
        component: 'text-field',
        name: "ddf.prop_allowance",
        label: "Prop allowance, none: 0%, folding: 1.5%, fixed: 3%",
        isReadOnly: true,
        type: "number",
        dataType: 'float',
        resolveProps: (props, { meta, input }, formOptions) => {
          const { values } = formOptions.getState();
          let pa = 0.015;
          if (values.handicap_data.propellor.type === "none") {
            pa = 0.0;
          }
          if (values.handicap_data.propellor.type === "fixed") {
            pa = 0.03;
          }
          formOptions.change("ddf.prop_allowance", pa);
          return { value: pa };
        },
      },
      {
        component: 'text-field',
        name: "ddf.r",
        label: "Final Rating ",
        type: "number",
        dataType: 'float',
        isReadOnly: true,
        resolveProps: (props, { meta, input }, formOptions) => {
          const { values } = formOptions.getState();
          const r = values.ddf.mr - values.ddf.prop_allowance * values.ddf.mr;
          const thcf = Math.round(1000 * 0.125 * (Math.sqrt(r) + 3)) / 1000;
          formOptions.change("ddf.r", r);
          formOptions.change("handicap_data.thcf", thcf);
          return { value: r };
        },
      },
      {
        component: 'text-field',
        name: "handicap_data.thcf",
        label: "T(H)CF",
        isReadOnly: true,
      },
      {
        component: 'checkbox',
        shortcut: true,
        name: "ddf.east_coast",
        label: "Add racing headsails (e.g. for the East Coast Race)",
        dataType: "boolean",
      },
    ],
  },
  headsail("biggest_staysail", "biggest_jib-step"),
  headsail("biggest_jib", "biggest_downwind_sail-step"),
  headsail("biggest_downwind_sail", "done-step"),
  {
    name: "no-handicap-step",
    shortcut: true,
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
