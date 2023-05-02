import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import './HomePage.scss';
import MyMap from './Map/MyMap';
import { Map, TileLayer, MapContainer, Marker, Popup } from 'react-leaflet';
import { emitter } from '../../utils/emitter';
import { getAllCoor, getExist } from '../../services/userService';




class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isStart: false,
            coorFromEsp: [],
            checkCreate: false,
        }
        this.listenToEmitter = this.listenToEmitter.bind(this);
    }

    async componentDidMount() {
        this.listenToEmitter();
    }

    listenToEmitter() {
        emitter.on('CREATE_COMPLETE', async () => {
            // console.log('create complete');
            this.setState({
                checkCreate: true
            });
            try {
                let prevCheck = await getExist();
                emitter.emit('CHECK_EXIST', prevCheck);
                // console.log('pre', prevCheck);
                setInterval(async () => {
                    let data = await getAllCoor();
                    // console.log('lat:', data.data.users.value1, 'lng', data.data.users.value2)
                    if (data.data.users) {
                        emitter.emit('RECEIVE_FROM_ESP', { data });
                    }
                    let currentCheck = await getExist();
                    // console.log('currentCheck:', JSON.stringify(currentCheck), 'prevCheck:', JSON.stringify(prevCheck));
                    if (JSON.stringify(currentCheck) !== JSON.stringify(prevCheck)) {
                        // console.log('cur', currentCheck);
                        emitter.emit('CHECK_EXIST', currentCheck);
                        prevCheck = currentCheck;
                    }
                }, 200);
            } catch (e) {
                console.log(e);
            }
        });
    }




    render() {
        return (
            <div>
                <div >
                    <HomeHeader />
                    <MyMap />
                </div>
            </div >
        );
    }

}



const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
