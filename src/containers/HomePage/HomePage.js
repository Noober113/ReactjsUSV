import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import './HomePage.scss';
import MyMap from './Map/MyMap';
import { Map, TileLayer, MapContainer, Marker, Popup } from 'react-leaflet';
// import event from './Map/event'
// import MapWithMarkers from './Map/event';


// const api = process.env.MAP_API_KEY

class HomePage extends Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         center: [10.8220589, 106.6867365],
    //         // myAPIKey: process.env.MAP_API_KEY,
    //         // link: `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${this.state.myAPIKey}`,
    //         // mapIsReadyCallback: this.mapIsReadyCallback.bind(this),
    //     }
    // }

    // async componentDidMount() {
    // }

    // mapIsReadyCallback(map) {
    //     console.log(map);
    // }


    render() {
        return (
            <div>
                <div >
                    <HomeHeader />

                    <div className='hienmap'>
                        {/* <div className="spinner-border text-secondary icload"></div>
                        <div className='loadtext'>
                            Map is Loading
                        </div> */}
                        <MyMap

                        />

                    </div>
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
