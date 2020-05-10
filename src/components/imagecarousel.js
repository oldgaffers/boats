import React from 'react';


const Thumb = ({ image }) => {
    return (<ReactImage src={image.uri} size="tiny" />)
}

const ImageCarousel = ({ key }) => {
    if(!key) {
        return "We don't have any pictures of this boat. We'd love to have some!"
    }

    return (
    );
}

export default ImageCarousel