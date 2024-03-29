import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { emitter } from '../../utils/emitter';
import './DashBoard.scss';
import ReactSpeedometer from "react-d3-speedometer";
import { auto } from '@popperjs/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label, ReferenceArea } from 'recharts';
import { getDeviation, getAllCoor } from '../../services/userService';
import { Map, TileLayer, MapContainer, Marker, Popup, useMapEvents, useMap, MapConsumer, Polyline, Circle, ZoomControl, flyTo } from 'react-leaflet';


class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [
                { timestamp: new Date().getTime(), meters: 0 },
            ],
            sensor: [
                {
                    timestamp: new Date().getTime(),
                    s1: 0,
                    s2: 0,
                    s3: 0,
                    s4: 0,
                },
            ],
            speed: 0,
            allData: [
                {
                    lat: 0,
                    lng: 0,
                    course: 0,
                    distance: 0,
                    maspeed: 0,
                    respeed: 0,
                    process: 0,
                    date: 0,
                    stt: null,
                }
            ],
            online: 1,
        }
        this.listenToEmitter = this.listenToEmitter.bind(this);
    }

    async componentDidMount() {
        this.listenToEmitter();
        setInterval(async () => {
            try {
                let data = await getDeviation();
                let sensor = await getAllCoor();
                // console.log(sensor.data.users);
                this.setState({
                    data: [...this.state.data, {
                        timestamp: new Date().getTime(),
                        meters: data.data,
                    }],
                    sensor: [...this.state.sensor, {
                        timestamp: new Date().getTime(),
                        s1: sensor.data.users.value_1,
                        s2: sensor.data.users.value_2,
                        s3: sensor.data.users.value_3,
                        s4: sensor.data.users.value_4,
                    }],
                    speed: sensor.data.users.value_6,
                    allData: {
                        lat: sensor.data.users.latitude,
                        lng: sensor.data.users.longitude,
                        course: sensor.data.users.course,
                        distance: sensor.data.users.distance,
                        maspeed: sensor.data.users.speed,
                        respeed: sensor.data.users.value_6,
                        process: sensor.data.users.value_5,
                        date: sensor.data.users.createdAt,
                        stt: sensor.data.users.status,
                    }
                });

                if (sensor.data.users.status) {
                    alert('Phát hiện vật cản !!!!, không thể di chuyển')
                }

                let current = new Date().getTime();
                let check = new Date(sensor.data.users.createdAt).getTime();
                // const timestamp = check.getTime();
                let diffTime = current - check;
                if (diffTime < 60 * 1000) {
                    // The current time is greater than the database time by 1 minute.
                    this.setState({
                        online: 1,
                    })
                } else {
                    // The current time is not greater than the database time by 1 minute.
                    this.setState({
                        online: 0,
                    })
                }
                // console.log(current, '-', check, '-', diffTime, this.state.online)
            } catch (e) {
                console.log(e);
            }
            // console.log(this.state.data)
        }, 2000);

    }

    listenToEmitter() {

    }


    // checkDate = () => {
    //     let current = new Date();
    //     let i = this.state.allData.length - 1;
    //     let check =  this.state.allData[i].date;
    //     let diffTime = current - check;
    //     if (diffTime > 60 * 1000) {
    //         // The current time is greater than the database time by 1 minute.
    //         this.setState({
    //             online: 1
    //         })
    //     } else {
    //         // The current time is not greater than the database time by 1 minute.
    //         this.setState({
    //             online: 0
    //         })
    //     }
    // }

    render() {
        const CustomTooltip = ({ active, payload }) => {
            if (active && payload && payload.length) {
                return (
                    <div className="custom-tooltip">
                        <p className="label">{`${new Date(payload[0].payload.timestamp).toLocaleTimeString()}`}</p>
                        <p className="label">{`Deviation: ${payload[0].value}m`}</p>
                    </div>
                );
            }

            return null;
        };
        const Custom = ({ active, payload }) => {
            if (active && payload && payload.length) {
                return (
                    <div className="custom">
                        <p className="label">{`Timestamp : ${new Date(payload[0].payload.timestamp).toLocaleTimeString()}`}</p>
                        <p className="label">{`Sensor1 : ${payload[0].payload.s1}`}</p>
                        <p className="label">{`Sensor2 : ${payload[0].payload.s2}`}</p>
                        <p className="label">{`Sensor3 : ${payload[0].payload.s3}`}</p>
                        <p className="label">{`Sensor4 : ${payload[0].payload.s4}`}</p>

                    </div>
                );
            }

            return null;
        };

        // const polylinePositions = this.state.allData.map((allData) => [allData.lat, allData.lng]);

        return (
            <div>

                <form>
                    <div className='boz1 container-fluid' style={{ overflow: 'hidden' }}>
                        <div className='upperrow'>
                            <div className='upper-left' style={{ width: '50%' }}>
                                {/* <i> Deviation chart</i>
                                <br /> */}
                                <ResponsiveContainer width="100%" height="100%"
                                >
                                    <LineChart width={500} height={300} data={this.state.data} title='Deviation Chart'
                                        margin={{
                                            top: 40,
                                            right: 5,
                                            left: 5,
                                            bottom: 5,
                                        }}>
                                        <XAxis dataKey="timestamp" type="number" domain={['auto', 'auto']}
                                            tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()}>
                                            <Label value="Deviation chart" offset={300} position="top" />
                                        </XAxis>
                                        <YAxis dataKey="meters" unit="m"
                                        // label={{ value: 'Deviation Chart', angle: -90, position: 'left', offset: 0 }}
                                        />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="monotone" dataKey="meters" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            {/* <div className='upper-cen'>

                            </div> */}
                            <div className='upper-rih' style={{ width: '50%' }}>
                                <ResponsiveContainer width="100%" height="100%" >
                                    <LineChart
                                        width={500}
                                        height={300}
                                        data={this.state.sensor}
                                        margin={{
                                            top: 40,
                                            right: 5,
                                            left: 5,
                                            bottom: 5,
                                        }}
                                        // label={{ value: 'Value of ultrasonic sensor', angle: -90, position: 'top' }}
                                        title='Sensor Chart'
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="timestamp" type="number" domain={['auto', 'auto']}
                                            tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()}
                                            label={{ value: 'Sensor Chart', position: 'top', offset: '280' }} />
                                        <YAxis unit="cm"
                                            domain={[0, 150
                                                // Math.max(
                                                // ...this.state.sensor.map((d) => Math.max(d.s1, d.s2, d.s3, d.s4)))
                                            ]}
                                        />
                                        <ReferenceArea y1={0} y2={70} label="Dangerous" stroke="red" strokeOpacity={0.3} />
                                        <Tooltip content={<Custom />} />
                                        <Legend />
                                        <Line type="monotone" dataKey="s1" stroke="red" name='sensor 1' strokeWidth={2} />
                                        <Line type="monotone" dataKey="s2" stroke="#07fa4c" name='sensor 2' strokeWidth={2} />
                                        <Line type="monotone" dataKey="s3" stroke="blue" name='sensor 3' strokeWidth={2} />
                                        <Line type="monotone" dataKey="s4" stroke="violet" name='sensor 4' strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                        </div>
                        <div className='upperrow'>
                            <div className='upper-left' style={{ width: '20%', display: 'block', margin: '3rem' }}>

                                <i>
                                    Process: {this.state.allData.process}
                                </i>
                                <br />
                                <i>
                                    Distance to the next point: {this.state.allData.distance}
                                </i>
                                <br />
                                <i>
                                    {/* Machine speed: {this.state.allData.maspeed} */}
                                    Angle to the next point: {this.state.allData.course}
                                </i>
                                <br />
                                <i>
                                    Real speed: {this.state.allData.respeed}
                                </i>
                                <br />
                                <i>
                                    Machine speed: {this.state.allData.maspeed}
                                </i>
                                <br />
                                <i>
                                    Latitude: {this.state.allData.lat}
                                </i>
                                <br />
                                <i>
                                    Longitude: {this.state.allData.lng}
                                </i>
                            </div>
                            <div className='upper-cen' style={{ width: '60%' }} >
                                <div className='speed'>
                                    <div className='name_char'>
                                        Speedometer
                                    </div>
                                    <div className='spedometer'>
                                        < ReactSpeedometer
                                            className='mr-auto '
                                            minValue={0}
                                            maxValue={5}
                                            segments={1}
                                            // width={'305px'}
                                            value={this.state.speed}
                                            currentValueText="${value} km/h"
                                            // currentValueText="Speed chart"
                                            needleColor='black'
                                        // label='adsda'
                                        // segmentColors={'red'}
                                        // height={'8rem'}
                                        // width={'8rem'}
                                        />
                                    </div>

                                </div>

                            </div>
                            <div className='upper-rih' style={{ width: '20%' }}>
                                {/* <i class="far fa-check-circle" style={{ color: 'blue' }}> Online</i>
                                <i class="far fa-times-circle" style={{ color: 'blue' }}></i> */}
                                {this.state.online ? <i class="far fa-check-circle" style={{ color: 'blue' }}> Online</i> : <i class="far fa-times-circle" style={{ color: 'red' }}> Offline</i>}
                            </div>

                        </div>
                    </div >
                </form >
            </div >
        );
    }

}



const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
