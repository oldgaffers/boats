
import React from 'react'
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import PermMediaIcon from '@material-ui/icons/PermMedia';

export default props => 
  <div className='buttons fadein'>
    <div className='button'>
      <label htmlFor='single'>
        <InsertPhotoIcon/>
      </label>
      <input type='file' id='single' onChange={props.onChange} /> 
    </div>
    
    <div className='button'>
      <label htmlFor='multi'>
        <PermMediaIcon/>
      </label>
      <input type='file' id='multi' onChange={props.onChange} multiple />
    </div>
  </div>