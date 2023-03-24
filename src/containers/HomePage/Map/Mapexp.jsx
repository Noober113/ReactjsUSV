import React, { useEffect } from 'react';
import './Mapexp.scss';
import L from 'leaflet';

function Mapexp() {
    let mapContainer;

    useEffect(() => {
        const initialState = {
            lng: 106.6867365,
            lat: 10.8220589,
            zoom: 17
        };

        const map = L.map(mapContainer).setView(
            [initialState.lat, initialState.lng],
            initialState.zoom
        );

        const myAPIKey = '198dcfa357864483bbc15b7aea665cfb';
        const isRetina = L.Browser.retina;
        const baseUrl =
            'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey={apiKey}';
        const retinaUrl =
            'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey={apiKey}';

        const markerIcon = L.icon({
            iconUrl: `https://api.geoapify.com/v1/icon?size=xx-large&type=awesome&color=%233e9cfe&icon=paw&apiKey=${myAPIKey}`,
            iconSize: [31, 46], // size of the icon
            iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
        });
        const zooMarker = L.marker([10.8220589, 106.6867365], {
            icon: markerIcon
        }).addTo(map);


        L.tileLayer(isRetina ? retinaUrl : baseUrl, {
            attribution:
                'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap <a href="https://www.openstreetmap.org/copyright" target="_blank">contributors</a>',
            apiKey: myAPIKey,
            maxZoom: 20,
            id: 'osm-bright'
        }).addTo(map);
    }, [mapContainer]);

    return <div className="map-container" ref={(el) => (mapContainer = el)}></div>;
}

export default Mapexp;
