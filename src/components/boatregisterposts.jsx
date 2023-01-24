import axios from "axios";
import { boatRegisterHome } from '../util/constants';

export async function nextOgaNo() {
  return axios.get('https://fxaj7udnm64v43j6fjo4zqer5u0xmhra.lambda-url.eu-west-1.on.aws/');
}

export async function disposeOgaNo(oga_no) {
  return axios.post(
    'https://fxaj7udnm64v43j6fjo4zqer5u0xmhra.lambda-url.eu-west-1.on.aws/',
    `${oga_no}`,
    {
      headers: { 'content-type': 'application/json' }
    }
    );
}

export async function shuffleBoats() {
  return axios.post(
    'https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/shuffle',
    {},
    {
      headers: { 'content-type': 'application/json' }
    }
  );
}

export async function postBoatData(data) {
  return axios.post(
    'https://5cegnkuukaqp3y2xznxdfg75my0ciulc.lambda-url.eu-west-1.on.aws/',
    data,
    {
      headers: { 'content-type': 'application/json' }
    }
  );
}

export async function postScopedData(scope, subject, data, accessToken) {
  const headers = {
    'content-type': 'application/json',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return axios.post(
    `https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/${scope}/${subject}`,
    data,
    { 'content-type': 'application/json', headers },
  );
}

export async function getScopedData(scope, subject, filters, accessToken) {
  const headers = {
    'content-type': 'application/json',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return axios({
    url: `https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/${scope}/${subject}`,
    params: {
      ...filters,
    },
    headers,
  });
}

export async function putGeneralEnquiry(scope, subject, data) {
  return axios.put(
    `https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/${scope}/${subject}`,
    data,
    {
      headers: { 'content-type': 'application/json' }
    }
  );
}

export async function postGeneralEnquiry(scope, subject, data) {
  return axios.post(
    `https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/${scope}/${subject}`,
    data,
    {
      headers: { 'content-type': 'application/json' }
    }
  );
}

export async function postCrewEnquiry(data) {
  return axios.post(
    'https://bne25yrc5scp5qgffis2yfqaj40txzef.lambda-url.eu-west-1.on.aws/',
    data,
    {
      headers: { 'content-type': 'application/json' }
    }
  );
}

export async function createPhotoAlbum(name, ogaNo) {
  const data = { name, oga_no: ogaNo };
  const r = await axios.post('https://7epryku6aipef3mzdoxtds3e5i0yfgwn.lambda-url.eu-west-1.on.aws/',
    data,
    {
      headers: { 'content-type': 'application/json' },
      validateStatus: (status) => (status >= 200 && status < 300) || (status === 409),
    }
  );
  if (r.status === 409) {
    console.log('conflict', r.data);
  }
  return r.data.albumKey;
}

export async function getThumb(albumKey) {
  return axios.get(`https://7epryku6aipef3mzdoxtds3e5i0yfgwn.lambda-url.eu-west-1.on.aws/${albumKey}`);
}

export async function getBoatData(ogaNo) {
  return axios.get(
    `${boatRegisterHome}/boatregister/page-data/boat/${ogaNo}/page-data.json`
  );
}

export async function getUploadCredentials() {
  return axios.get('https://n5sfnt3ewfaq3lp4wqg64lzen40gzpdq.lambda-url.eu-west-1.on.aws/');
}

export async function getPicklists() {
  return axios.get(`${boatRegisterHome}/boatregister/pickers.json`);
}

export async function getFilterable() {
  return axios(`${boatRegisterHome}/boatregister/filterable.json`);
}

export async function getAlbumKey(oga_no) {
  return await axios.get(`https://7epryku6aipef3mzdoxtds3e5i0yfgwn.lambda-url.eu-west-1.on.aws/albumKey/${oga_no}`);
}
