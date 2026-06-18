/* Browser-specific test setup: filter out known non-fatal console warnings from React/MUI
   to keep test output focused. Keep filters minimal and explicit so real
   errors still surface during development.
*/

const IGNORED_PATTERNS = [
  /Module "util" has been externalized for browser compatibility/,
  /Either `children`, `image`, `src` or `component` prop must be specified/,
  /MUI: The value provided to Autocomplete is invalid/,
  /An update to .* inside a test was not wrapped in act\(\.\.\.\)/,
  /Warning: An update to .* inside a test was not wrapped in act/,
  /React does not recognize the `.*` prop on a DOM element/,
  /Could not parse CSS stylesheet/,
];

// Preserve originals
const _err = console.error.bind(console);
const _warn = console.warn.bind(console);

console.error = (...args) => {
  try {
    if (args && args.length) {
      const msg = args.join(' ');
      if (IGNORED_PATTERNS.some((r) => r.test(msg))) return;
    }
  } catch (e) {
    _err('Error in test console.error filter:', e);
  }
  _err(...args);
};

console.warn = (...args) => {
  try {
    if (args && args.length) {
      const msg = args.join(' ');
      if (IGNORED_PATTERNS.some((r) => r.test(msg))) return;
    }
  } catch (e) {
    _warn('Error in test console.warn filter:', e);
  }
  _warn(...args);
};
