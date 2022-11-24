import axios from "axios";
import { useAxios } from 'use-axios-client';
import { boatRegisterHome } from '../util/constants';

export async function postBoatData(data) {
  console.log(postBoatData, data);
  return axios.post(
    'https://5cegnkuukaqp3y2xznxdfg75my0ciulc.lambda-url.eu-west-1.on.aws/',
    data,
    {
      headers: { 'content-type': 'application/json' }
    }
  );
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
  console.log('createPhotoAlbum', data);
  const r = await axios.post('https://7epryku6aipef3mzdoxtds3e5i0yfgwn.lambda-url.eu-west-1.on.aws/',
    data,
    {
      headers: { 'content-type': 'application/json' }
    }
  );
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