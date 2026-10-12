import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import humanizeDuration from 'humanize-duration';
import { CompactBoatCard } from './boatcard';
import { customIcons } from "../util/mapicons";


function BoatMarker({ boat }) {

    const { latitude, longitude, timestamp, source } = boat.location;
    const age = (new Date()).getTime() - (new Date(timestamp)).getTime()
    const d = humanizeDuration(age, { round: true, largest: 2 });
    const title = `${boat.name} ${d} ago from ${source || 'whatsapp'}`;
    return <Marker
        key={boat.oga_no}
        position={[latitude, longitude]}
        icon={boat.icon||customIcons.gaffer_blue}
        title={title}
        eventHandlers={{
            click: () => {
                // console.log('marker clicked')
            },
        }}
    >
        <Popup maxWidth='200'>
            <CompactBoatCard ogaNo={boat.oga_no} />
        </Popup>
    </Marker>;
}

export default function BoatMarkers({ entries }) {
    // const map = useMap()
    // const oms = new OverlappingMarkerSpiderfier(map);

    const visible = (entries || []).filter((boat) => {
        if (boat.location) {
            const up = new Date(boat.location.timestamp).getTime();
            const n = new Date().getTime();
            const days_old = Math.floor((n - up) / 86400000);
            // console.log(days_old);
            if (days_old > 6) {
                return false;
            }
            return boat.visible;
        }
        return false;
    });

    return <MarkerClusterGroup chunkedLoading>
        {visible.map((boat) => <BoatMarker key={boat.ogaNo} boat={boat} />)}
    </MarkerClusterGroup>;
}