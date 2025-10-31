import { geolocate, getFilterable } from "./api";

export default async function boatsByHomePort() {
    const boats = await getFilterable()
    const filtered = boats.filter((b) =>(b.home_port||'') !== '');
    const located = await Promise.all(filtered.map(async (b) => {
        const g = await geolocate(b.home_port);
        if (g?.lat) {
            return { ...b, ...g, latitude: g.lat, longitude: g.lng };
        }
        return null;
    }));
    const valid = (await located).filter((p) => p !== null);
    return { Items: valid };
}