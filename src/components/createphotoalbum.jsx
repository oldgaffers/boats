import axios from "axios";

export async function createPhotoAlbum(ogaNo) {
    const r = axios.post('https://7epryku6aipef3mzdoxtds3e5i0yfgwn.lambda-url.eu-west-1.on.aws/',
        { oga_no: ogaNo }
      );
    return r.data.albumKey;
}