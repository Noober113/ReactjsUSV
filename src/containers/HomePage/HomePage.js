import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import './HomePage.scss';
import MyMap from './Map/MyMap';
import { Map, TileLayer, MapContainer, Marker, Popup } from 'react-leaflet';
// import event from './Map/event'
// import MapWithMarkers from './Map/event';
import { emitter } from '../../utils/emitter';
import { createCoor, getAllCoor } from '../../services/userService';



// const api = process.env.MAP_API_KEY

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isStart: false,
            coorFromEsp: [],
        }
        // this.listenToEmitter();
    }

    async componentDidMount() {
        // try {
        // setInterval(async () => {
        //     let data = await getAllCoor();
        //     // console.log('lat:', data.data.users.value1, 'lng', data.data.users.value2)
        //     emitter.emit('RECEIVE_FROM_ESP', { data });

        // }, 200);

        // } catch (e) {
        //     console.log(e)
        // }
        // await this.listenToEmitter();
    }


    handleStartUsv = async () => {
        try {
            for (let i = 0; i < this.state.coorList.length; i++) {
                let data = await createCoor(this.state.coorList[i].newPosition.lat, this.state.coorList[i].newPosition.lng);

                if (data && data.data.errCode !== 0) {
                    this.setState({
                        errMessage: data.data.message
                    })
                }
                if (data && data.data.errCode === 0) {
                    console.log('success')
                    console.log(data.config.data)
                }
            };

        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
        }
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
