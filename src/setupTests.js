// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock react-leaflet for tests since jest doesn't handle ES modules well
jest.mock('react-leaflet', () => {
  const React = require('react');
  return {
    MapContainer: ({ children }) => <div>{children}</div>,
    TileLayer: () => null,
    Marker: ({ children }) => <div>{children}</div>,
    Popup: ({ children }) => <div>{children}</div>,
  };
});
