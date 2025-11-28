import  React from "react";
import Typography from "@mui/material/Typography";
import { fThcf } from "../util/THCF";
import { boatm2f } from '../util/format';
import ConditionalText from './conditionaltext';

const hideUnlessChecked = false;

export function HandicapDisplay({ boat }) {
  if (!boat) return null;
  const handicapData = boat?.handicap_data || {};
  const thcf = fThcf(boatm2f(boat));
  let handicapDisplay = thcf.toFixed(3);
  if (thcf > 0.1) {
    if (handicapData.last_modified) {
      const lmd = new Date(handicapData.last_modified);
      handicapDisplay = `${handicapDisplay} (last modified ${lmd.toLocaleDateString()})`;
    }
    if (handicapData.thcf && Math.abs(thcf - handicapData.thcf) > 0.01) {
      handicapDisplay = `${handicapDisplay} (stored THCF ${handicapData.thcf.toFixed(3)})`;
    }
    if (hideUnlessChecked && (handicapData.checked === false)) {
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
    return <>
      <ConditionalText label='T(H)CF' value={handicapDisplay} />
      <ConditionalText label='Solent Rating' value={handicapData.solent?.thcf?.toFixed(3)} />
    </>;
  } else if (handicapData.thcf) {
    const val = handicapData.thcf.toFixed(3);
    return <Typography>Handicap cannot be calculated but we do have a stored value of {val}. This should only be used with caution.</Typography>;
  } else {
    return '';
  }
}
export default HandicapDisplay;