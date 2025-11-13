/* Global test setup: filter out known non-fatal console warnings from React/MUI
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
    // If our filter throws, still print the original error so tests fail noisily
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

// Small helper: ensure a minimal global sessionStorage exists in Node unit tests
if (typeof globalThis.sessionStorage === 'undefined') {
  const storage = new Map();
  globalThis.sessionStorage = {
    getItem: (k) => (storage.has(k) ? storage.get(k) : null),
    setItem: (k, v) => storage.set(k, String(v)),
    removeItem: (k) => storage.delete(k),
    clear: () => storage.clear(),
  };
}
