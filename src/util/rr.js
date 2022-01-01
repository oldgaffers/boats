
export function prefix(location) {
  const origin = location.origin || window.location.origin;
  const pathname = location.pathname || window.location.pathname;
  let test = '';
  if (pathname && pathname.includes('test')) {
    test = 'test_';
  }
  const r = `${origin}/boat_register/${test}`;
  return r;
}

export function boatUrl(oga_no, location ) {
    return `${prefix(location)}boat?oga_no=${oga_no}`;
}
