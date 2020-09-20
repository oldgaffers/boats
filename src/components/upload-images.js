import React from 'react'
import CancelIcon from '@material-ui/icons/Cancel';

export default props => 
  props.images.map((image, i) =>
    <div key={i} className='fadein'>
      <div 
        onClick={() => props.removeImage(image.public_id)} 
        className='delete'
      >
      <CancelIcon/>
      </div>
      <img src={image.secure_url} alt='' />
    </div>
  )