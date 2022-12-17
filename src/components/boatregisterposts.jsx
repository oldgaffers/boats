import axios from "axios";
import { useAxios } from 'use-axios-client';
import { boatRegisterHome } from '../util/constants';

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

export async function postPrivateScopedData(scope, subject, data, accessToken) {
  return axios.post(
    `https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/${scope}/${subject}`,
    data,
    {
      'content-type': 'application/json',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    }
  );
}

export async function getScopedData(scope, subject, filters, accessToken) {
  return axios({
    url: `https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/${scope}/${subject}`,
    params: {
      ...filters,
    },
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    }
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

export function useGetThumb(albumKey) {
  return useAxios(`https://7epryku6aipef3mzdoxtds3e5i0yfgwn.lambda-url.eu-west-1.on.aws/${albumKey}`);
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

export async function getBoatData(ogaNo) {
  return axios.get(
    `${boatRegisterHome}/boatregister/page-data/boat/${ogaNo}/page-data.json`
  );
}

export function useGetBoatData(ogaNo) {
  return useAxios(`${boatRegisterHome}/boatregister/page-data/boat/${ogaNo}/page-data.json`);
}

export async function getUploadCredentials() {
  return axios.get('https://n5sfnt3ewfaq3lp4wqg64lzen40gzpdq.lambda-url.eu-west-1.on.aws/');
}

export function useGetPicklists() {
  return useAxios(`${boatRegisterHome}/boatregister/pickers.json`);
}

export function useGetFilterable() {
  console.log('useGetFilterable');
  return useAxios(`${boatRegisterHome}/boatregister/filterable.json`);
}

export async function getFilterable() {
  return axios(`${boatRegisterHome}/boatregister/filterable.json`);
}