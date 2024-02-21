import { Box, Stack, Typography } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import Voyage from './voyage';

export default function Voyages({ voyages, user }) {
    const roles = user?.['https://oga.org.uk/roles'] || [];

    const sortedVoyages = [...voyages];
    sortedVoyages.sort((a, b) => a.start.localeCompare(b.start));

    let introText = 'These are the voyages the owners have made public.';

    if (user) {
      if (roles.includes('member')) {
        introText = 'The owners have told us about the following voyages.';
      } else {
        introText = `${introText} Members get to see any additional voyages restricted to members only.`;
      }
    } else {
      introText = `${introText} Logged in members get to see any additional voyages restricted to members only.`;
    }

    return <Stack>
    <Box overflow='auto' minWidth='50vw' maxWidth='85vw'>
      <Typography>{introText}</Typography>
      <Grid container spacing={2}>
        {sortedVoyages.map((voyage, index) =>
          <Grid key={index} xs={4} minWidth={300}>
            <Voyage key={`v${index}`} voyage={voyage} />
          </Grid>
        )}
      </Grid>
    </Box>
  </Stack>;
}