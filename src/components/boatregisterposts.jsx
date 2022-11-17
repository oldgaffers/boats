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

