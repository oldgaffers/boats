import { boatRegisterHome } from '../util/constants';

export async function nextOgaNo() {
  return (await fetch('https://fxaj7udnm64v43j6fjo4zqer5u0xmhra.lambda-url.eu-west-1.on.aws/')).json();
}

export async function disposeOgaNo(oga_no) {
  return fetch(
    'https://fxaj7udnm64v43j6fjo4zqer5u0xmhra.lambda-url.eu-west-1.on.aws/',
    {
      method: 'POST',
      body: `${oga_no}`,
      headers: { 'content-type': 'application/json' }
    }
  );
}

export async function shuffleBoats() {
  return fetch(
    'https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/shuffle',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' }
    }
  );
}

export async function postBoatData(body) {
  return fetch(
    'https://t5lcpwbufg6ewyxswawwsbtkjq0kupbb.lambda-url.eu-west-1.on.aws/',
    {
      method: 'POST',
      body,
      headers: { 'content-type': 'application/json' }
    }
  );
}

export async function postScopedData(scope, subject, body, accessToken) {
  const headers = {
    'content-type': 'application/json',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return fetch(
    `https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/${scope}/${subject}`,
    {
      method: 'POST',
      body,
      headers,
    },
  );
}

export async function getScopedData(scope, subject, filters, accessToken) {
  const headers = {
    'content-type': 'application/json',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return fetch(
    `https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/${scope}/${subject}?`
    + new URLSearchParams(filters),
    {
      headers,
    });
}

export async function putGeneralEnquiry(scope, subject, data) {
  return fetch(
    `https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/${scope}/${subject}`,
    data,
    {
      method: 'PUT',
      headers: { 'content-type': 'application/json' }
    }
  );
}

export async function postGeneralEnquiry(scope, subject, body) {
  return fetch(
    `https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/${scope}/${subject}`,
    {
      method: 'POST',
      body,
      headers: { 'content-type': 'application/json' }
    }
  );
}

export async function postCrewEnquiry(body) {
  return fetch(
    'https://bne25yrc5scp5qgffis2yfqaj40txzef.lambda-url.eu-west-1.on.aws/',
    {
      method: 'POST',
      body,
      headers: { 'content-type': 'application/json' }
    }
  );
}

export async function createPhotoAlbum(name, ogaNo) {
  const body = { name, oga_no: ogaNo };
  const r = await fetch('https://7epryku6aipef3mzdoxtds3e5i0yfgwn.lambda-url.eu-west-1.on.aws/',
    {
      headers: { 'content-type': 'application/json' },
      body,
      method: 'POST',
      validateStatus: (status) => (status >= 200 && status < 300) || (status === 409),
    }
  );
  if (r.status === 409) {
    // console.log('conflict', r);
  }
  return r.albumKey;
}

export async function getThumb(albumKey) {
  return (await fetch(`https://7epryku6aipef3mzdoxtds3e5i0yfgwn.lambda-url.eu-west-1.on.aws/${albumKey}`)).json();
}

export async function getBoatData(ogaNo) {
  return (await fetch(`${boatRegisterHome}/boatregister/page-data/boat/${ogaNo}/page-data.json`)).json();
}

export async function getUploadCredentials() {
  return (await fetch('https://n5sfnt3ewfaq3lp4wqg64lzen40gzpdq.lambda-url.eu-west-1.on.aws/')).json();
}

export async function getPicklists() {
  return (await fetch(`${boatRegisterHome}/boatregister/pickers.json`)).json();
}

export async function getFilterable() {
  return (await fetch(`${boatRegisterHome}/boatregister/filterable.json`)).json();
}

export async function getAlbumKey(oga_no) {
  return (await fetch(`https://7epryku6aipef3mzdoxtds3e5i0yfgwn.lambda-url.eu-west-1.on.aws/albumKey/${oga_no}`)).json();
}

export async function getLargestImage(albumKey) {
  return (await fetch(`https://7epryku6aipef3mzdoxtds3e5i0yfgwn.lambda-url.eu-west-1.on.aws/${albumKey}/li`)).json();
}
