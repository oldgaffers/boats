import { geolocate, getFilterable, getPlaces } from "./api";

export default async function boatsByPlaceBuilt(filters = {}) {
    // const boats = await getFilterable();
    const places = await getPlaces();
    places.sort((a, b) => b.count - a.count);
    const located = await Promise.all(places.slice(0,700).map(async (p) => {
        let n = p.place;
        const g = await geolocate(n);
        if (g.lat) {
            return { ...p, ...g, latitude: g.lat, longitude: g.lng };
        }
        console.log(p.place, g);
        return null;
    }));
    const valid = (await located).filter((p) => p !== null);
    return { Items: valid };
}