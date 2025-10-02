import { geolocate, getPlaces } from "./api";

export default async function boatsByPlaceBuilt(filters = {}) {
    // const boats = await getFilterable();
    const places = Object.values(await getPlaces());
    const filtered = places.filter((p) => p.count > 1);
    filtered.sort((a, b) => b.count - a.count);
    const located = await Promise.all(filtered.map(async (p) => {
        let n = p.place;
        const g = await geolocate(n);
        if (g?.lat) {
            return { ...p, ...g, latitude: g.lat, longitude: g.lng };
        }
        // console.log(p, g);
        return null;
    }));
    const valid = (await located).filter((p) => p !== null);
    return { Items: valid };
}