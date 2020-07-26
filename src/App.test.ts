// import React from 'react';
// import { render } from '@testing-library/react';
// import App from './App';

import { sum } from "src/components/temp";

// test('renders learn react link', () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

test("basic again", () => {
    expect(sum(1, 2)).toBe(3);
});
