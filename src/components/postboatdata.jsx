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