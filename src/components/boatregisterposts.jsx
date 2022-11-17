import axios from "axios";

export async function postBoatData(data) {
    return axios.put(
      'https://5cegnkuukaqp3y2xznxdfg75my0ciulc.lambda-url.eu-west-1.on.aws/',
      data,
    );
}

export async function postCrewEnquiry(data) {
  return axios.post(
  'https://bne25yrc5scp5qgffis2yfqaj40txzef.lambda-url.eu-west-1.on.aws/',
  data);
}

export async function createPhotoAlbum(name, ogaNo) {
  const data = { name, oga_no: ogaNo };
  console.log('createPhotoAlbum', data);
    const r = await axios.post('https://7epryku6aipef3mzdoxtds3e5i0yfgwn.lambda-url.eu-west-1.on.aws/',
        data,
      );
    return r.data.albumKey;
}
