import React from 'react';
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

export default function Skippers({skippers, email}) {
    return <Box>
    {skippers.map((skipper) => <Box key={skipper.id}>
        <Paper dangerouslySetInnerHTML={{ __html: skipper.skipper.text }} />
    </Box>)}
    </Box>;
}
