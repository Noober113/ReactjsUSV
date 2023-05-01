import React, { Component, useState, useEffect } from 'react';
import { Map, TileLayer, MapContainer, Marker, Popup, useMapEvents, useMap, MapConsumer, Polyline, Circle, ZoomControl } from 'react-leaflet';
// import './MyMap.scss';
import 'leaflet/dist/leaflet.css';
import { connect } from 'react-redux';
import 'leaflet-deepzoom';
import { L, map, icon } from 'leaflet';
import { emitter } from '../../../utils/emitter';
import { LeafletTrackingMarker } from 'react-leaflet-tracking-marker';
import airplane from '../../../assets/images/boat.png';



class MyMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            espCoor: { lat: 10.8220589, lng: 106.6867365 },
            count: 0,
            radius: '',
        }
        this.listenToEmitter();

    }

    async componentDidMount() {

    }

    listenToEmitter() {
        emitter.on('RECEIVE_FROM_ESP', data => {
            const { latitude, longitude } = data.data.data.users;
            this.setState(({
                espCoor: { lat: latitude, lng: longitude },
            }));
        });
        emitter.on('NUMBER_POINT_IN_MAP', countAddCoor => {
            this.setState(({
                count: countAddCoor,
            }));
            // console.log('map', countAddCoor)
        });

    }

    handleMapReady(map) {
        // console.log('Map is fully loaded!', map);
        emitter.emit('CREATE_COMPLETE');
    }


    render() {
        return (
            <div >
                <MapContainer
                    center={[10.8220589, 106.6867365]}
                    zoom={18}
                    style={{
                        width: '100vw',
                        height: '92vh'
                    }}
                    zoomControl={false} // disable default zoom control
                    whenReady={this.handleMapReady}

                >
                    <TileLayer
                        url="https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=198dcfa357864483bbc15b7aea665cfb"
                        attribution='Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors'
                        maxZoom={20}
                    />
                    {/* add zoom control to top right corner  */}
                    <ZoomControl position="topright" />
                    <LocationMarker
                        count={this.state.count}
                    // radius={this.state.radius}
                    />
                    <DisplayMarker
                        espCoor={this.state.espCoor} />
                </MapContainer>

            </div>
        );
    }

}




// function Displaymap() {
//     let mapContainer;
//     useEffect(() => {
//         const initialState = {
//             lng: 11,
//             lat: 49,
//             zoom: 4
//         };

//         const myAPIKey = 'YOUR_API_KEY_HERE';
//         const mapStyle = 'https://maps.geoapify.com/v1/styles/osm-carto/style.json';

//         olms(mapContainer, `${mapStyle}?apiKey=${myAPIKey}`).then((map) => {
//             map.getView().setCenter(proj.transform([initialState.lng, initialState.lat], 'EPSG:4326', 'EPSG:3857'));
//             map.getView().setZoom(initialState.zoom);
//         });
//     }, [mapContainer]);

//     return (<div className="map-container" ref={el => mapContainer = el}></div>)
// }


// const url = 'path/to/tiles/';
// const deepZoomLayer = L.tileLayer.deepzoom(url, {
//     width: 5000,
//     height: 5000
// });


// function MyComponent() {
//     const map = useMap()
//     console.log('map center:', map.getCenter())
//     return null
// }

// user setting coordition


function LocationMarker(props) {
    const [positions, setPositions] = useState([]);
    const { count } = props;

    // Define custom icon
    const myIcon = new icon({
        iconUrl:
            'https://api.geoapify.com/v1/icon/?type=material&color=red&icon=cloud&iconType=awesome&apiKey=198dcfa357864483bbc15b7aea665cfb',
        iconSize: [31, 46],
        iconAnchor: [15.5, 42],
        popupAnchor: [0, -45],
    });

    const polylinePositions = positions.map((position) => [position.lat, position.lng]);


    const removeMarker = (position) => {
        setPositions(positions.filter((m) => m !== position));
        emitter.emit('DELETE_EVENT_IN_MAP', { position });
    };

    const map = useMapEvents({
        click(e) {
            const newPosition = e.latlng;
            if (positions.length < count) { // Add a check to make sure the array does not exceed 15 items
                setPositions([...positions, newPosition]);
                // map.flyTo(newPosition, map.getZoom());
                // console.log(newPosition)
                emitter.emit('EVENT_POINT_IN_MAP', newPosition);
            }
        },

    });

    useEffect(() => {
        const deleteEventListener = (data) => {
            const position = data.position;
            removeMarker(position);
        };

        emitter.on('DELETE_EVENT_IN_HOME', deleteEventListener);

        return () => {
            emitter.off('DELETE_EVENT_IN_HOME', deleteEventListener);
        };
    }, [positions]);

    useEffect(() => {
        const checkListEventListener = (checkList) => {
            if (checkList !== 0) {
                let newPosition = checkList.map((point) => ({ lat: point.latitude, lng: point.longitude }))
                let cor = newPosition
                console.log('a', cor[0]);
                try {
                    setPositions(checkList.map((point) => ({ lat: point.latitude, lng: point.longitude })));
                    for (let i = 0; i < cor.length; i++) {
                        emitter.emit('EVENT_POINT_IN_MAP', cor[i]);
                    }
                } catch (error) {
                    console.error(error);
                }
            };
        }

        emitter.on('CHECK_EXIST', checkListEventListener);

        return () => {
            emitter.off('CHECK_EXIST', checkListEventListener);
        };
    }, []);

    return (
        <>
            {/* <MapContainer
                onclick={handleAddMarker}> */}
            {positions.map((position, index) => {
                return (
                    <Marker key={index} position={position} icon={myIcon} >
                        <Popup>
                            point number {index + 1}
                            <br />
                            lat: {position.lat}
                            <br />
                            lon: {position.lng}
                            {/* <br />
                            <button onClick={() => removeMarker(position)}>Remove this point</button> */}
                        </Popup>
                        {/* Add a circle around the marker  unit meter */}
                        {/* <Circle center={position} radius={radius} /> */}
                    </Marker>
                )
            })}
            {polylinePositions.length > 1 && <Polyline positions={polylinePositions} />}
            {/* </MapContainer> */}
        </>
    );
}


function DisplayMarker(props) {
    const { espCoor } = props;


    const myIcon = new icon({
        iconSize: [45, 45],
        popupAnchor: [2, -20],
        iconUrl: airplane
    });

    const { lat, lng } = espCoor;
    const [prevPos, setPrevPos] = useState([lat, lng]);

    useEffect(() => {
        if (prevPos[1] !== lng && prevPos[0] !== lat) setPrevPos([lat, lng]);
    }, [lat, lng, prevPos]);

    return (
        <>
            <LeafletTrackingMarker
                icon={myIcon}
                position={[lat, lng]}
                previousPosition={prevPos}
                duration={1000}
            >
                <Popup>{"Hello, there! 🐱‍🏍 "}</Popup>
            </LeafletTrackingMarker>
        </>
    );
}


export default connect()(MyMap);
