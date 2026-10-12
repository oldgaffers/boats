import * as L from 'leaflet';

function gaffer(colour) {
    return L.icon({
        iconUrl: `https://oldgaffers.github.io/boatregister//images/gaffer-${colour}.png`,
        shadowUrl: 'https://oldgaffers.github.io/boatregister//images/shadow-gaffer.png',
        iconSize: [32, 37], // size of the icon
        shadowSize: [51, 37], // size of the shadow
        iconAnchor: [16, 34], // point of the icon which will correspond to marker's location
        shadowAnchor: [16, 34],  // the same for the shadow
        popupAnchor: [16, 18] // point from which the popup should open relative to the iconAnchor
    });
}

export const customIcons = {

    gaffer_blue: gaffer('blue'),

    gaffer_orange: gaffer('orange'),

    blackDiamond: L.icon({
        iconUrl: `https://oldgaffers.github.io/boatregister//images/diamond.png`,
        shadowUrl: 'https://oldgaffers.github.io/boatregister//images/shadow-gaffer.png',
        iconSize: [32, 32], // size of the icon
        shadowSize: [51, 37], // size of the shadow
        iconAnchor: [16, 34], // point of the icon which will correspond to marker's location
        shadowAnchor: [16, 34],  // the same for the shadow
        popupAnchor: [16, 18] // point from which the popup should open relative to the iconAnchor
    }),

    whiteDiamond: L.icon({
        iconUrl: `https://oldgaffers.github.io/boatregister//images/diamond-white.png`,
        shadowUrl: 'https://oldgaffers.github.io/boatregister//images/shadow-gaffer.png',
        iconSize: [32, 32], // size of the icon
        shadowSize: [51, 37], // size of the shadow
        iconAnchor: [16, 34], // point of the icon which will correspond to marker's location
        shadowAnchor: [16, 34],  // the same for the shadow
        popupAnchor: [16, 18] // point from which the popup should open relative to the iconAnchor
    }),

    gaffling: L.icon({
        iconUrl: `https://oldgaffers.github.io/boatregister//images/gaffling.png`,
        shadowUrl: 'https://oldgaffers.github.io/boatregister//images/shadow-gaffer.png',
        iconSize: [32, 32], // size of the icon
        shadowSize: [51, 37], // size of the shadow
        iconAnchor: [16, 34], // point of the icon which will correspond to marker's location
        shadowAnchor: [16, 34],  // the same for the shadow
        popupAnchor: [16, 18] // point from which the popup should open relative to the iconAnchor
    }),

    lug: L.icon({
        iconUrl: `https://oldgaffers.github.io/boatregister//images/lug.png`,
        shadowUrl: 'https://oldgaffers.github.io/boatregister//images/shadow-gaffer.png',
        iconSize: [32, 32], // size of the icon
        shadowSize: [51, 37], // size of the shadow
        iconAnchor: [16, 34], // point of the icon which will correspond to marker's location
        shadowAnchor: [16, 34],  // the same for the shadow
        popupAnchor: [16, 18] // point from which the popup should open relative to the iconAnchor
    }),

    yard: L.icon({
        iconUrl: 'https://oldgaffers.github.io/boatregister//images/anchor.png',
        shadowUrl: 'https://oldgaffers.github.io/boatregister//images/anchor-shadow.png',
        iconSize: [32, 32], // size of the icon
        shadowSize: [48, 32], // size of the shadow
        iconAnchor: [16, 34], // point of the icon which will correspond to marker's location
        shadowAnchor: [16, 34],  // the same for the shadow
        popupAnchor: [16, 18] // point from which the popup should open relative to the iconAnchor
})

};
