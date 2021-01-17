import React from 'react';

export const Link = ({ className, to, children }) => {
    console.log('Link', to);
    return <a className={className} href={to}>{children}</a>;
}

export const Router = ({children}) => {
    const { location } = window;
    switch (React.Children.count(children)) {
      case 0: return null;
      default:
        return <>{React.Children.map(children, (child) => React.cloneElement(child, {location}, child.props.children))}</>;
    }
  }
  
  export const Route = ({location, path, children, state={}}) => {
    console.log('Route', location.pathname, path);
    const matcher = new RegExp('.*'+path);
    if (matcher.test(location.pathname)) {
      console.log('Route children', children);
      for (const [key, value] of new URLSearchParams(location.search)) {
        state[key] = value;
      };
      const props = { location, state };
      return <>{React.Children.map(children, (child) => React.cloneElement(child, props, child.props && child.props.children))}</>;
    }
    return '';
  }
  