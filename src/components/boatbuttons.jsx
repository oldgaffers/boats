import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import PhotoButton from './photobutton';
import EditButton from './editbutton';
import AdminButton from './adminbutton';
import Enquiry from './enquiry';
import SetHandicapCheckedButton from './sethandicapchecked';
import { useAuth0 } from '@auth0/auth0-react';

export default function BoatButtons({ boat }) {
  const user = useAuth0();
  const roles = user?.['https://oga.org.uk/roles'] || [];

  const photoCancelled = () => {
    // console.log('cancel');
  }

  const photoDone = () => {
    // console.log('done');
  }

  return (
    <Paper>
        <Grid container direction='row' alignItems='flex-end' justifyContent='space-evenly'>
        <Grid item xs={'auto'}>
          <Button size="small"
              color='primary'
              variant="contained"
            // eslint-disable-next-line no-restricted-globals
            onClick={() => history.back()}
          >See more boats</Button>
        </Grid>
        <Grid item xs={'auto'} >
            <Enquiry boat={boat} />
        </Grid>
        <Grid item xs={'auto'} >
            <PhotoButton
              boat={boat} user={user}
              onCancel={photoCancelled}
              onDone={photoDone}
              color='secondary'
            />
        </Grid>
        <Grid item xs={'auto'} >
            <EditButton boat={boat} color='secondary'/>
        </Grid>
        {roles.includes('editor')
          ? (<Grid item xs={'auto'} ><AdminButton boat={boat} user={user} color='secondary'/></Grid>)
          : ''
        }
        <SetHandicapCheckedButton boat={boat} user={user} />
        </Grid>
    </Paper>
  );
};
