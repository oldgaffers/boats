import React from 'react';

export default function Link({ className, to, children }) {
    console.log('Link', to);
    return <a className={className} href={to}>{children}</a>;
}
