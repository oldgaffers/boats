import React from 'react';
import { Box, Typography } from "@mui/material";

export default function Disclaimer(props) {
    return <Box {...props}>
    <Typography marginBottom={2} marginLeft={1} marginRight={1}>The
    OGA is only providing an introduction service
    between potential skipper and potential crew.
    </Typography>
    <Typography marginBottom={2} marginLeft={1} marginRight={1}>
        No recommendation is made or implied on the suitability of skipper or crew,
        nor of the seaworthiness of the vessel or any safety equipment.</Typography>
        <Typography marginLeft={1} marginRight={1}>Furthermore each party must assure
        themselves that they wish to proceed with any arrangement</Typography>
    </Box>;
}