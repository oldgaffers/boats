import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import BoatRegisterIntro from "./boatregisterintro";
import BoatsForSaleIntro from "./boatsforsaleintro";
import BoatsToSailIntro from "./boatstosailintro";
import SmallBoatsIntro from "./smallboatsintro";

export function IntroText({ view }) {
    if (view === 'sell') {
        return <BoatsForSaleIntro />;
      }
      if (view === 'small') {
        return <SmallBoatsIntro />;
      }
      if (view === 'sail') {
        return <BoatsToSailIntro />;
      }
      return <BoatRegisterIntro />;
}

export default function Intro({ view }) {
    // console.log('Intro', view);
    return (
      <Accordion defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandCircleDownIcon />}>
          <Typography>About the boat Register</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <IntroText view={view}/>
        </AccordionDetails>
      </Accordion>
    );
  }