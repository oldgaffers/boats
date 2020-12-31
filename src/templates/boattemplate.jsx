import React from 'react';
import { Link } from 'gatsby';
import { BoatWrapper } from '../components/boatwrapper';

const BoatTemplate = ({ pageContext }) => {

  const { boat, home, absolute, pickers } = pageContext;
  return (<BoatWrapper
    boat={boat}
    pickers={pickers}
    link={Link}
    home={home}
    absolute={absolute}
    />);
};

export default BoatTemplate;