import React from 'react';

export default function FBShare({link}) {
    const fbhref = `https://www.facebook.com/sharer/sharer.php?u=${link}&amp;src=sdkpreparse`;
    return (
        <div className="fb-share-button" data-href={link} data-layout="button_count" data-size="small">
            <a rel="noopener noreferrer" target="_blank" href={fbhref} className="fb-xfbml-parse-ignore">Share</a>
        </div>
    );

}
