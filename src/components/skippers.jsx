import React from 'react';
import { Box, Paper } from "@mui/material";

export default function Skippers({skippers, email}) {
    return <Box>
    {skippers.map((skipper) => <Box key={skipper.id}>
        <Paper dangerouslySetInnerHTML={{ __html: skipper.skipper.text }} />
    </Box>)}
    </Box>;
}
