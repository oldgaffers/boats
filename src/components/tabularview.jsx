import React from 'react';
import Container from '@mui/material/Container';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useCardQuery, getBoats } from '../util/cardquery';

const nested = {
    type: 'string',
    valueFormatter: ({ value }) => value && value.name,
  };

  const imagelink = {
    type: 'string',
    valueFormatter: ({ value }) => value,
  };

  const array = {
    type: 'string',
    valueFormatter: ({ value }) => value && value.join(', '),
  };
  
const columns = [
    { field: 'oga_no', headerName: 'No', width: 90 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'year', headerName: 'Year', type: 'date',  width: 90 },
    { field: 'short_description', headerName: 'Description', width: 200 },
    { field: 'designerByDesigner', headerName: 'Designer', width: 200, ...nested },
    { field: 'builderByBuilder', headerName: 'Builder', width: 200, ...nested },
    { field: 'price', headerName: 'Price', type: 'number', hide: true, width: 200 },
    { field: 'home_port', headerName: 'Home Port', width: 130 },
    { field: 'place_built', headerName: 'Place Built', width: 130 },
    { field: 'previous_names', headerName: 'Previous Names', width: 130, ...array },
    { field: 'thumb', headerName: 'Image', width: 130, ...imagelink },
  ];
  
export default function TablularView({ state, marked }) {
  const { loading, error, data } = useCardQuery(state);
  if (error) console.log(JSON.stringify(error));

  const boats = getBoats(data).map(boat => ({...boat, id: boat.oga_no}));

  if (error) return <p>Error: (TabularView)</p>;

  if (loading) {
    if (data) {
      console.log('Loading set but data here');
    } else {
      return <p>Loading...</p>;
    }
  }

  console.log(boats[0]);
  
  return (
      <Container sx={{maxHeight: '40vh'}}>
            <DataGrid
                rows={boats} columns={columns} 
                autoHeight={true} autoPageSize={true} 
                components={{ Toolbar: GridToolbar }}
                
            />
        </Container>
    );

}
