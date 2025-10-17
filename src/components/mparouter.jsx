import { Children, cloneElement } from 'react';

export const Link = ({ className, to, children }) => {
    return <a className={className} href={to}>{children}</a>;
}

export const Router = ({children}) => {
    const { location } = window;
    switch (Children.count(children)) {
      case 0: return null;
      default:
        return <>{Children.map(children, (child) => cloneElement(child, {location}, child.props.children))}</>;
    }
  }
  
  export const Route = ({location, path, children, state={}}) => {
    const matcher = new RegExp('.*'+path);
    if (matcher.test(location.pathname)) {
      for (const [key, value] of new URLSearchParams(location.search)) {
        state[key] = value;
      };
      const props = { location, state };
      return <>{Children.map(children, (child) => cloneElement(child, props, child.props && child.props.children))}</>;
    }
    return '';
  }
  