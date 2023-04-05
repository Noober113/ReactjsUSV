import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formatDiagnosticsWithColorAndContext } from 'typescript';
import './HomeHeader.scss';
import { emitter } from '../../utils/emitter';



class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdown: false,
            menuBar: false,
            setting: false,
            coor: { lat: 0, lng: 0 },
            coorList: [],
            isClose: false,
            countAddCoor: 0,
            coordinates: []
        }
    }


    handleUserDropDown = () => {
        this.setState({
            dropdown: !this.state.dropdown,
        })
        console.log('event in header:', this.state.dropdown)
    }

    handleMenuBar = () => {
        this.setState({
            menuBar: !this.state.menuBar,
        })
        // console.log(this.state.setting)
    }

    handleSetting = () => {
        this.setState({
            setting: !this.state.setting,
            menuBar: !this.state.menuBar,
        })
        // console.log(this.state.setting)

    }

    handleCloseSetting = () => {
        this.setState({
            setting: !this.state.setting,
            menuBar: !this.state.menuBar
        })
    }

    handleShowList = () => {
        this.setState({
            isShowList: !this.state.isShowList
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

    handleCloseMenuBar = () => {
        this.setState({
            menuBar: !this.state.menuBar
        })
    }

    addCoorBut = () => {
        if (this.state.countAddCoor < 15) {
            this.setState({
                countAddCoor: this.state.countAddCoor + 1,
                coordinates: [...this.state.coordinates, `Coordinate ${this.state.countAddCoor + 1}`] // Add a new coordinate to the array
            })
        }
    }

    delCoorBut = () => {
        if (this.state.countAddCoor > 0) {
            this.setState({
                countAddCoor: this.state.countAddCoor - 1,
                coordinates: this.state.coordinates.slice(0, -1) // Remove the last coordinate from the array
            })
        }
    }

    render() {
        const { countAddCoor, coordinates } = this.state; // Destructure state variables for easier access in the render method
        return (
            <div>
                <div className='container-fluid'>
                    <div className='col left'>
                        <button type='button' className='bar-but'
                            onClick={() => { this.handleMenuBar() }}>
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>
                    <div className='col cen'>
                        {/* <div className='header-logo'></div> */}
                        Logo
                    </div>
                    <div className='col right'>
                        <button type="button"
                            className="but-right"
                        // onClick={() => { this.handleUserDropDown() }}
                        >
                            <i className="fas fa-user-circle"></i>
                        </button>
                        {/* <div className={this.state.dropdown ? "" : "dropdown-menu"} >
                            <a className="dropdown-item" href="#">Manage User</a>
                            <a className="dropdown-item" href="#">Sign out</a>
                        </div> */}
                    </div>
                    <div>
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
                                                        onClick={() => { this.handleCloseMenuBar() }}
                                                    >
                                                        <i className="fas fa-sign-out-alt fa-rotate-180"></i>
                                                        <span>Close</span></a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* SETTING PANEL */}
                            {/* <div > */}
                            <div className={this.state.setting ? "visible  left-panel" : 'invisible   left-panel'}>
                                {/* <div className="visible  left-panel"> */}
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            Setting
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
                                                        Coordinate list
                                                    </button>
                                                </h2>
                                                <div id="collapseOne"
                                                    className={this.state.isShowList ? "accordion-collapse collapse show" : 'accordion-collapse collapse'} >
                                                    {/* <div id="collapseOne"
                                                    className="accordion-collapse collapse show"> */}
                                                    <div className="accordion-body">

                                                        <ul className="list-group list-group-flush d-flex settingcoor" id="lstUnv">
                                                            {/* {
                                                                this.state.coorList.map((item, index) => (
                                                                    <li className="list-group-item" key={index}>
                                                                        number: {++index}<br />
                                                                        lat: {item.newPosition.lat}<br />
                                                                        lng: {item.newPosition.lng}
                                                                    </li>
                                                                ))} */}
                                                            <li className='pb-2'>
                                                                <button type="button" className="btn btn-primary  addnewcoor"
                                                                    onClick={() => { this.addCoorBut() }}>
                                                                    <i className="fas fa-plus"></i> Add new coordinates
                                                                </button>
                                                            </li>
                                                            {coordinates.map((item, index) => (
                                                                <li className="list-group-item displayoptioncoor" key={index}>
                                                                    #{++index}
                                                                    <i className="fas fa-trash-alt p-2 deletebut"
                                                                        onClick={() => { this.delCoorBut() }}></i>
                                                                    <form>
                                                                        <div className="form-group d-flex mb-1">
                                                                            <label className='disLat'>Lat: </label>
                                                                            <input type="text" className="form-control" placeholder="Input Latitude" />
                                                                        </div>
                                                                        <div className="form-group d-flex">
                                                                            <label className='disLng'>Lng: </label>
                                                                            <input type="text" className="form-control" placeholder="Input Longitude" />
                                                                        </div>
                                                                    </form>                                                                </li>
                                                            ))}

                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* </div> */}
                                    <div>
                                        <div className="form-group d-flex mb-1 ipraci">
                                            <label className='laipraci'>Circle: </label>
                                            <input type="text" className="form-control" placeholder="Input radius" />
                                        </div>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input " />
                                            <label className="form-check-label">go around</label>
                                        </div>
                                        <button type="button"
                                            className="btn btn-outline-primary startbut"
                                            onClick={(event) => { this.handleStartUsv(event) }}>
                                            Start
                                        </button>
                                        <button type="button" className="btn btn-outline-danger stopbut">Stop</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*  Menu left bar */}


            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
