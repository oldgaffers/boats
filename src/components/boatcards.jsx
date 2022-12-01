import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import BoatPagination from './boatpagination';
import BoatCard from './boatcard';
import { useCardQuery } from '../util/oganoutils';

export default function BoatCards({
  state, markList=[],
  onChangePage=(arg)=>console.log('onChangePage', arg), 
  onBoatMarked,
  onBoatUnMarked,
}) {

  const as = useCardQuery(state);

  if (as.error) return <p>Error: (BoatCards)</p>;

  if (as.loading) {
      return <p>Loading...</p>;
  }
  const { totalCount, boats } = as.data;

  const handleMarkChange = (value, ogaNo) => {
    if (value) {
      onBoatMarked && onBoatMarked(ogaNo);
    } else {
      onBoatUnMarked && onBoatUnMarked(ogaNo);
    }
  }

  if (totalCount > 0) {
    const pageCount = Math.ceil(totalCount / state.bpp);
    const handlePageChange = (_, page) => { onChangePage({ selectedBoats: totalCount, pages: pageCount, page })};
    return (
      <Container maxWidth="md">
        <BoatPagination onChange={handlePageChange} count={pageCount} page={state.page}/>
          <Box py={1} />
          <Grid container spacing={4}>
          {boats.map((boat) => {
            const marked = markList.includes(boat.oga_no);
            return (
            <Grid item key={boat.oga_no} xs={12} sm={6} md={4}>
              <BoatCard state={state} marked={marked} ogaNo={boat.oga_no} onMarkChange={handleMarkChange} />
            </Grid>
            );
          }
          )
          }
          </Grid>
          <Box py={1}/>
          <BoatPagination onChange={handlePageChange} count={pageCount} page={state.page}/>
        </Container>
    );
  }

  const { 
    rig_type, construction_material, generic_type, 
    design_class, firstYear, lastYear, mainsail_type,
    designer, builder, oga_no, oga_nos, name
  } = state.filters;
  const { sale } = state.view || {};
  let message;
  if (oga_no) {
    message = `The boat numbered ${oga_no} doesn't match the filters you have set`;
  } else if (oga_nos) {
    switch (oga_nos.length) {
      case 0:
      message = `You need to mark one or more boats. Click on the box at the bottom right-hand corner of the boat's card`;  
      break;
      case 1:
        message = `The boat numbered ${oga_nos[0]} doesn't match the filters you have set`;  
        break;
      default:
      message = `The boats numbered ${oga_nos.join(', ')} don't match the filters you have set`;
    }
  } else {
    message = 'There are no';
    if (rig_type) {
      message = `${message} ${rig_type} rigged`;
    }
    if (design_class) {
      message = `${message} ${design_class}s`;
    } else if (generic_type) {
      message = `${message} ${generic_type}s`;
    } else {
      message = `${message} boats`;
    }
    if (mainsail_type) {
      message = `${message} with a ${mainsail_type} main`;
    }
    if (designer) {
      message = `${message} by this designer`;
    }
    if (builder) {
      message = `${message} by this builder`;
    }
    if (firstYear && lastYear) {
      message = `${message} built between ${firstYear} and ${lastYear}`;
    } else if (firstYear) {
      message = `${message} built after ${firstYear}`;
    } else if (lastYear) {
      message = `${message} built before ${lastYear}`;
    }
    if (construction_material) {
      message = `${message} built of ${construction_material}`;
    }
    if (sale) {
      message = `${message} for sale`;
    }
    message = `${message} on the register`;
    if (name) {
      message = `${message} which have ever been called ${name}`;
    }
  }

  return (
    <Grid container alignItems='stretch'>
    <Grid item xs={2}></Grid>
      <Grid item>
      <Typography variant='h6'>{message}.</Typography>
      <Typography variant='h6'>Try removing some filters.</Typography>
    </Grid>
    <Grid item xs={2}></Grid>
  </Grid>);
}
