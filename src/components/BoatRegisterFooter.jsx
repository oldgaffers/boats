import React from 'react';
import { List, ListItem, Typography } from '@mui/material';
import pkg from '../../package.json';

export default function BoatRegisterFooter() {
    return <>
      <Typography>
        Other great places to look for boats are:
      </Typography>
      <List>
        <ListItem>
          <Typography>
            <a target="_blank" rel="noreferrer" href="https://www.nationalhistoricships.org.uk">
              National Historic Ships
            </a>
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>
            <a target="_blank" rel="noreferrer" href="https://nmmc.co.uk/explore/databases/">NMM Cornwall</a>&nbsp;
            maintain a number of interesting databases including small boats and
            yacht designs
          </Typography>
        </ListItem>
      </List>
      <Typography variant='body2'>OGA Boat Register {pkg.version}</Typography>
    </>;
}