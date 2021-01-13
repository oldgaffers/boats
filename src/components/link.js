import React from 'react';

export default function Link({ to, children }) {

    console.log('Link', to);
    return <a href={to}>{children}</a>;
}