import React from 'react';
import Iframe from 'react-iframe'

const url = 'https://oga.smugmug.com/frame/slideshow'
const queryString = 'autoStart=1&captions=1&navigation=1'
    +'&playButton=1&randomize=1&speed=3&transition=fade&transitionSpeed=2'

const SmugMugGallery = ({ classes, albumKey }) => {
    if (albumKey) {
        return (
            <Iframe
            url={`${url}?key=${albumKey}&${queryString}`}
            width="800" 
            height="600" 
            frameborder="no" 
            scrolling="no"
            className={classes.iframe}
            />
        );    
    }
    return null
}

export default SmugMugGallery