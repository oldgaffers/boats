export function thumb(key) {
    return `https://photos.smugmug.com/photos/i-${key}/0/Th/i-${key}-Th.jpg`;
}
//https://photos.smugmug.com/photos/i-bsFkRLL/0/Th/i-bsFkRLL-Th.jpg
//https://photos.smugmug.com/Boats/OGA-431/i-bsFkRLL/0/4a53da07/Th/file-Th.jpg
//https://oga.smugmug.com/Boats/OGA-431/i-bsFkRLL/A
/*

const getThumbNail = async albumKey => {
    const api_key = process.env.SMUGMUG_API_KEY;
    const r = await axios.get(
      `https://api.smugmug.com/api/v2/album/${albumKey}!highlightimage`,
      {
        headers: { Accept: "application/json" },
        params: {
          APIKey: api_key
        }
      }
    );
    if (r.Response.AlbumImage) {
      return r.Response.AlbumImage.ThumbnailUrl;
    }
    return null;
  };
  
  const getAlbumKey = async id => {
    const api_key = process.env.SMUGMUG_API_KEY;
    const r = await axios.get("https://api.smugmug.com/api/v2!weburilookup", {
      headers: { Accept: "application/json" },
      params: {
        APIKey: api_key,
        WebUri: "//oga.smugmug.com/Boats/OGA-" + id
      }
    });
    if (r.Response.Album) {
      return r.Response.Album.AlbumKey;
    }
    return null;
  };
  */