import axios from "axios";

export async function createBoatRecord(email, boat) {
    return axios.post(
    'https://5cegnkuukaqp3y2xznxdfg75my0ciulc.lambda-url.eu-west-1.on.aws/',
    { email, new: boat }
  );
}