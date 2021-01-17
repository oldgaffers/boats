import React from 'react';
import { render } from '@testing-library/react';
import ImageUpload from './imageupload';

test('test image upload', () => {
  let r;
  const { getByText } = render(<ImageUpload />);
  const linkElement = getByText(/upload some pictures/i);
  expect(linkElement).toBeInTheDocument();
  expect(r).toBe(undefined);
});
