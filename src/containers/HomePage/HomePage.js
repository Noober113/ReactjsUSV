import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import './HomePage.scss';
import MyMap from './Map/MyMap';
import { Map, TileLayer, MapContainer, Marker, Popup } from 'react-leaflet';
// import event from './Map/event'
// import MapWithMarkers from './Map/event';
import { emitter } from '../../utils/emitter';



// const api = process.env.MAP_API_KEY

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menuBar: false,
            setting: false,
            isClose: false,
            isShowList: false,
            coor: { lat: 0, lng: 0 },
            coorList: []
        }
        this.listenToEmitter();
    }

    // async componentDidMount() {
    // }

    // mapIsReadyCallback(map) {
    //     console.log(map);
    // }
    listenToEmitter() {
        emitter.on('EVENT_CLICK_SETTINNG', () => {
            this.setState({
                menuBar: !this.state.menuBar
            })
        })
    }

    listenToEmitter() {
        emitter.on('EVENT_POINT_IN_MAP', newPosition => {
            this.setState(prevState => ({
                coor: newPosition,
                coorList: [...prevState.coorList, newPosition] // add new position to list
            }));
            // console.log('lat:', this.state.coorList);
        });
    }

    handleSetting = () => {
        this.setState({
            setting: !this.state.setting,
            menuBar: !this.state.menuBar
        })

    }

    handleCloseSetting = () => {
        this.setState({
            setting: !this.state.setting,
            menuBar: !this.state.menuBar
        })
    }

    handleCloseMenuBar = () => {
        this.setState({
            menuBar: !this.state.menuBar
        })
    }

    handleShowList = () => {
        this.setState({
            isShowList: !this.state.isShowList
        })
    }



    render() {
        return (
            <div>
                <div >
                    <HomeHeader />
                    <div className="wrapper">
                        {/* LEFT MENU BAR */}
                        <div className={this.state.menuBar ? "visible" : 'invisible'}>
                            <div className="vh-100 d-flex align-items-center position-fixed start-0 top-0" role="navigation">
                                <div className="p-2">
                                    <div id="mainNav">
                                        <ul className="list-unstyled rounded ms-2">
                                            <li>
                                                <a className="vlink rounded border-0"
                                                    href="#">
                                                    <i className="fas fa-home"></i>
                                                    <span>Home</span></a>
                                            </li>
                                            <li>
                                                <a className="vlink rounded"
                                                    onClick={() => { this.handleSetting() }}>
                                                    <i className="fas fa-cog "></i>
                                                    <span>Setting</span></a>
                                            </li>
                                            <li>
                                                <a className="vlink rounded"
                                                    href="#">
                                                    <i className="fas fa-chart-line"></i>
                                                    <span>Analysis</span></a>
                                            </li>
                                            <li>
                                                <a className="vlink rounded"
                                                    href="#">
                                                    <i className="fas fa-language"></i>
                                                    <span>Language</span></a>
                                            </li>
                                            <li>
                                                <a className="vlink rounded"
                                                    href="#">
                                                    <i className="fas fa-exclamation-circle"></i>
                                                    <span>About Us</span></a>
                                            </li>
                                            <li>
                                                <a className="vlink rounded"
                                                    onClick={() => { this.handleCloseMenuBar() }}>
                                                    <i className="fas fa-sign-out-alt fa-rotate-180"></i>
                                                    <span>Close</span></a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* SETTING PANEL */}
                        <div >
                            {/* <div className={this.state.setting ? "visible  left-panel" : 'invisible   left-panel'}> */}
                            <div className="visible  left-panel">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            Chức năng
                                            <i className="fas fa-arrow-left"
                                                style={{
                                                    float: 'right',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => { this.handleCloseSetting() }}
                                            ></i>
                                        </h5>
                                        <div className="accordion" id="accordionExample">
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="headingOne">
                                                    <button
                                                        className={this.state.isShowList ? "accordion-button collapsed" : 'accordion-button'}
                                                        onClick={() => { this.handleShowList() }}>
                                                        Danh sách
                                                    </button>
                                                </h2>
                                                {/* <div id="collapseOne"
                                                    className={this.state.isShowList ? "accordion-collapse collapse show" : 'accordion-collapse collapse'} > */}
                                                <div id="collapseOne"
                                                    className="accordion-collapse collapse show">
                                                    <div className="accordion-body">

                                                        <ul className="list-group list-group-flush d-flex align-items-center" id="lstUnv">
                                                            {
                                                                this.state.coorList.map((item, index) => (
                                                                    <li className="list-group-item" key={index}>
                                                                        number: {++index}<br />
                                                                        lat: {item.newPosition.lat}<br />
                                                                        lng: {item.newPosition.lng}
                                                                    </li>
                                                                ))}
                                                        </ul>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <MyMap />
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
