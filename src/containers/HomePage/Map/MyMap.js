import React, { Component, useState, useEffect } from 'react';
import { Map, TileLayer, MapContainer, Marker, Popup, useMapEvents, useMap, MapConsumer, Polyline, Circle, ZoomControl, flyTo } from 'react-leaflet';
import './MyMap.scss';
import 'leaflet/dist/leaflet.css';
import { connect } from 'react-redux';
import 'leaflet-deepzoom';
import { L, map, icon, distanceToLine, latLng, control, polyline } from 'leaflet';
import { emitter } from '../../../utils/emitter';
import { LeafletTrackingMarker } from 'react-leaflet-tracking-marker';
import airplane from '../../../assets/images/boat.png';
import { size } from 'lodash';
import { distanceSegment } from 'leaflet-geometryutil';
import { getDistanceFromLine } from 'geolib';



class MyMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            espCoor: { lat: 10.8847207, lng: 106.6632720 },
            count: 0,
            radius: '',
            distance: null,
            display: false,
        }
        this.mapRef = React.createRef();
        this.listenToEmitter();
        // this.handleClick = this.handleClick.bind(this);

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
        emitter.on('STATUS_DISPLAY', () => {
            this.setState(({
                display: !this.state.display,
            }));
        });
    }

    handleMapReady(map) {
        // console.log('Map is fully loaded!', map);
        emitter.emit('CREATE_COMPLETE');
    }

    caculateSth() {

    }

    // setInterval(this.handleClick, 500);




    handleFly(Map) {
        console.log('Map is fully loaded!', this.state.espCoor);

        Map.flyTo(latLng(this.state.espCoor), 20)
    }


    render() {
        return (
            <div >
                <MapContainer
                    center={[10.8220589, 106.6867365]}
                    zoom={18}
                    style={{
                        width: '100vw',
                        height: '90vh'
                    }}
                    zoomControl={false} // disable default zoom control
                    whenReady={this.handleMapReady}
                    whenCreated={(map) => {
                        this.map = map;
                    }}
                    onClick={this.handleClick}

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
                    <Button
                        espCoor={this.state.espCoor}
                    />
                    <DisplayMarker
                        espCoor={this.state.espCoor}
                        display={this.state.display}
                    />

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


function Button(props) {
    const { espCoor } = props;

    const map = useMapEvents({
        click(e) {

            map.flyTo(espCoor, map.getZoom(18));
        },

    });
    return (
        <>
            <div className='leaflet-control-container'>
                <div className='leaflet-top leaflet-right t-1 but-target'>
                    <div className='leaflet-control-zoom leaflet-bar leaflet-control'>
                        <a className='leaflet-control-zoom-in'
                            // href='#'
                            title='target'
                            role='button'
                        // onClick={(e) => {
                        //     this.handleClick(e.target)
                        // }}
                        // onClick={map}
                        >
                            <i
                                className='fas fa-crosshairs ml-3'
                                style={{
                                    fontSize: "17px",
                                    marginLeft: "-2.5px"

                                }}
                            />
                        </a>
                    </div>
                </div>
            </div>
        </>

    )
}


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
                // console.log(newPosition.lat, newPosition.lng);
                emitter.emit('EVENT_POINT_IN_MAP', newPosition);
            }
        },

    });

    useEffect(() => {
        const deleteEventListener = (data) => {
            const position = data.position;
            console.log(position)

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
                // const latLngObj = L.latLng(newPosition.lat, newPosition.lng);
                // console.log('a', latLngObj);
                try {
                    setPositions(checkList.map((point) => ({ lat: point.latitude, lng: point.longitude })));
                    for (let i = 0; i < cor.length; i++) {
                        emitter.emit('EVENT_POINT_IN_MAP', cor[i]);
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                setPositions([]);
            }
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
            {polylinePositions.length > 1 && <Polyline positions={polylinePositions} color='brown' />}
            {/* </MapContainer> */}
        </>
    );
}


function DisplayMarker(props) {
    const { espCoor } = props;
    const { display } = props;

    // const point = {
    //     type: "Point",
    //     coordinates: [10, 10],
    // };

    // const line = {
    //     type: "LineString",
    //     coordinates: [
    //         [0, 0],
    //         [10, 10],
    //         [20, 20],
    //     ],
    // };

    // const distance = distanceToLine(point, line)

    // console.log(distance); // 14.142135623730951
    // const polyline = L.polyline([], { color: 'red' }).addTo(map);

    const myIcon = new icon({
        iconSize: [45, 45],
        popupAnchor: [2, -20],
        iconUrl: airplane
    });

    const { lat, lng } = espCoor;
    const [prevPos, setPrevPos] = useState([lat, lng]);
    const [polylinePositions, setPolylinePositions] = useState([]);

    const handleClearClick = () => {
        setPolylinePositions(polylinePositions.slice(-1));
    };

    useEffect(() => {
        if (prevPos[1] !== lng && prevPos[0] !== lat) {
            setPrevPos([lat, lng]);
            // map.flyTo(prevPos, map.getZoom());
            // polyline.addLatLng([lat, lng]);
        }
        setPolylinePositions([...polylinePositions, [lat, lng]]);

        // setPrevPos([lat, lng]);
    }, [lat, lng, prevPos]);


    // const { lat, lng } = espCoor;
    // const polylinePositions = [[lat, lng]];
    // console.log(polylinePositions)

    return (
        <>
            <LeafletTrackingMarker
                icon={myIcon}
                position={[lat, lng]}
                previousPosition={prevPos}
                duration={1000}
            // rotationAngle={360}
            >
                <Popup>
                    {"Hello, there! 🐱‍🏍 "}
                    <br />
                    Latitude : {lat}, Longtude:{lng}
                    <br />
                    {/* <CalculateDistance /> */}
                    <button onClick={handleClearClick}>Clear</button>
                </Popup>
            </LeafletTrackingMarker>
            {(polylinePositions.length > 1 && display == true) && <Polyline positions={polylinePositions} color='blue' weight={'1'} dashOffset='5' dashArray={'10,5'} />}

        </>
    );
}




export default connect()(MyMap);
