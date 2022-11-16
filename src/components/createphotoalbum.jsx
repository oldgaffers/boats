import axios from "axios";

export async function createPhotoAlbum(name, ogaNo) {
    const r = await axios.post('https://7epryku6aipef3mzdoxtds3e5i0yfgwn.lambda-url.eu-west-1.on.aws/',
        { name, oga_no: ogaNo }
      );
    return r.data.albumKey;
}