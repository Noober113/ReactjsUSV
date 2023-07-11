import React, { Component, useState, useEffect } from 'react';
import { Map, TileLayer, MapContainer, Marker, Popup, useMapEvents, useMap, MapConsumer, Polyline, Circle, ZoomControl, flyTo } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { connect } from 'react-redux';
import { L, map, icon, distanceToLine, latLng } from 'leaflet';
import { emitter } from '../../../utils/emitter';
import { LeafletTrackingMarker } from 'react-leaflet-tracking-marker';
import { size } from 'lodash';

class MiMap extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
        this.listenToEmitter();

    }

    async componentDidMount() {

    }

    listenToEmitter() {

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
                >
                    <TileLayer
                        url="https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=198dcfa357864483bbc15b7aea665cfb"
                        attribution='Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors'
                        maxZoom={20}
                    />
                </MapContainer>

            </div>
        );
    }

}




// import React from 'react';
// import { MapContainer, TileLayer } from 'react-leaflet';
// import { distanceToSegment } from 'leaflet-geometryutil';

// class MyComponent extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       distance: null,
//     };
//     this.handleClick = this.handleClick.bind(this);
//   }

//   handleClick(e) {
//     const point = [e.latlng.lat, e.latlng.lng];
//     const line = [[51.5, -0.1], [51.6, -0.2]];
//     const distance = distanceToSegment(point, line);
//     this.setState({ distance });
//   }

//   render() {
//     return (
//       <MapContainer
//         center={[51.505, -0.09]}
//         zoom={13}
//         whenCreated={(map) => (this.map = map)}
//         onClick={this.handleClick}
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         {this.state.distance !== null && (
//           <p>Distance: {this.state.distance} meters</p>
//         )}
//       </MapContainer>
//     );
//   }
// }




{/* <form>
                                            {/* <div className="form-group row">
                                                <label className="col-sm-2 col-form-label">cb1</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control" placeholder="1" value={this.state.vl[1] || ""} readOnly />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-2 col-form-label">cb2</label>
                                                <div className="col-sm-10">
                                                    <input type="text" className="form-control" placeholder="2" value={this.state.vl[2] || ""} readOnly />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-2 col-form-label">cb3</label>
                                                <div className="col-sm-10">
                                                    <input type="text" className="form-control" placeholder="3" value={this.state.vl[3] || ""} readOnly />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-2 col-form-label">cb4</label>
                                                <div className="col-sm-10">
                                                    <input type="text" className="form-control" placeholder="4" value={this.state.vl[4] || ""} readOnly />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-2 col-form-label">cap180</label>
                                                <div className="col-sm-10">
                                                    <input type="text" className="form-control" placeholder="cap180" value={this.state.vl[6] || ""} readOnly />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-2 col-form-label">distance</label>
                                                <div className="col-sm-10">
                                                    <input type="text" className="form-control" placeholder="distance" value={this.state.vl[7] || ""} readOnly />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-2 col-form-label">speed</label>
                                                <div className="col-sm-10">
                                                    <input type="text" className="form-control" placeholder="speed" value={this.state.vl[8] || ""} readOnly />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-2 col-form-label">j</label>
                                                <div className="col-sm-10">
                                                    <input type="text" className="form-control" placeholder="j" value={this.state.vl[5] || ""} readOnly />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-2 col-form-label">Real Speed</label>
                                                <div className="col-sm-10">
                                                    <input type="text" className="form-control" placeholder="speed" value={this.state.vl[9] || ""} readOnly />
                                                </div>
                                            </div> */}
{/* <Example /> */ }
                                            // <div className='boz1'>
                                            //     <div className='cha1'>
                                            //         <LineChart
                                            //             className='m-1 char1'
                                            //             xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                                            //             series={[
                                            //                 {
                                            //                     data: [2, 5.5, 2, 8.5, 1.5, 5],
                                            //                 },
                                            //             ]}
                                            //         />
                                            //     </div>
                                            //     <div className='cha1'>
                                            //         <LineChart
                                            //             className='m-1 char1'
                                            //             series={[
                                            //                 { data: [4000, 3000, 2000, 2780, 1890, 2390, 3490], label: 'pv' },
                                            //                 { data: [2400, 1398, 9800, 3908, 4800, 3800, 4300], label: 'uv' },
                                            //                 { data: [1700, 1398, 9800, 3556, 4800, 3800, 4300], label: 'ev' },
                                            //                 { data: [3324, 1398, 9800, 7866, 4800, 3800, 4300], label: 'dv' },
                                            //             ]}
                                            //             xAxis={[{
                                            //                 scaleType: 'point', data: [
                                            //                     'Page A',
                                            //                     'Page B',
                                            //                     'Page C',
                                            //                     'Page D',
                                            //                     'Page E',
                                            //                     'Page F',
                                            //                     'Page G',
                                            //                 ]
                                            //             }]}
                                            //         />
                                            //     </div>
                                            //     <div className='cha1'>

                                            //     </div>
                                            // </div>
                                            // <div className='boz1'>
                                            //     <div className='cha1'>
                                            //         {/* <MiMap /> */}
                                            //         {this.state.boat.lat}
                                            //     </div>
                                            //     <div className='cha1'>

                                            //         <ReactSpeedometer
                                            //             className='m-1 char2'
                                            //             minValue={0}
                                            //             maxValue={5}
                                            //             segments={1}
                                            //             value={1.11}
                                            //         />

                                            //     </div>
                                            //     <div className='cha1'>
                                            //         <div>
                                            //             <button type='button' onClick={this.calculateDistance}>Calculate Distance</button>
                                            //             {this.state.distance !== null && (
                                            //                 <p>Distance: {this.state.distance} meters</p>
                                            //             )}
                                            //         </div>
                                            //     </div>
                                            // </div>
                                        // </form > 