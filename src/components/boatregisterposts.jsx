import axios from "axios";

export async function postBoatData(name, oga_no, differences, email) {
    return axios.put(
    'https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/public/edit_boat',
    {
      name,
      oga_no,
      differences,
      originator: email,
    });
}

export async function postCrewEnquiry(data) {
  return axios.post(
  'https://bne25yrc5scp5qgffis2yfqaj40txzef.lambda-url.eu-west-1.on.aws/',
  data);
}

