import React, { useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import Images from './upload-images'
import Buttons from './upload-buttons'

const API_URL = 'https://7919d72bf588df2749fb8c6ed8289d51.m.pipedream.net';
//const API_URL = 'http://localhost:5000/upload';

function Upload({ boatName, ogaNo, albumKey }) {
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState([]);

    const onChange = e => {
        const files = Array.from(e.target.files);
        setUploading(true );

        const formData = new FormData()

        formData.append('boat_name', boatName);
        if (albumKey) {
            formData.append('album_key', albumKey);
        }
        formData.append('oga_no', ogaNo);
        formData.append('copyright', 'me');
        files.forEach((file, i) => {
            formData.append(i, file);
        })

        fetch(API_URL, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(images => {
            console.log(images);
            setUploading(false);
            setImages(images);
        })
    }

    const removeImage = id => {
        setImages(images.filter(image => image.public_id !== id));
    }
  
    return (
        <div>
        <div className='buttons'>
            {
                uploading?(
                    <CircularProgress />
                ):(images.length > 0)?(
                    <Images images={images} removeImage={removeImage} />
                ):(
                    <Buttons onChange={onChange} />
                )
            }
        </div>
        </div>
    );
}

export default Upload