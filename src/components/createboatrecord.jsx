import axios from "axios";

export async function createBoatRecord(email, boat) {
  try {
    const r = await axios.post(
    'https://5cegnkuukaqp3y2xznxdfg75my0ciulc.lambda-url.eu-west-1.on.aws/',
    { email, new: boat }
    );
    console.log('create boat record', r);
    return r;
  } catch (e) {
    console.log('error', e);
  }
  return undefined;
}