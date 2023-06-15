import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { formatDiagnosticsWithColorAndContext } from 'typescript';
import './HomeHeader.scss';
import { emitter } from '../../utils/emitter';
import { createCoor, changeStatus, changeSpeed } from '../../services/userService';
import { round } from 'lodash';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';


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
            coordinates: [],
            displayedCoordinates: [],
            radius: 0,
            stt: false,
            round: 0,
            exist: false,
            Analysis: false,
            vl: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
            speed: 0
        }
        this.listenToEmitter();

    }

    listenToEmitter() {
        emitter.on('EVENT_POINT_IN_MAP', newPosition => {
            // console.log('pos', newPosition)
            this.setState(prevState => ({
                coor: newPosition,
                coorList: [...prevState.coorList, newPosition],
                displayedCoordinates: [...prevState.displayedCoordinates, newPosition],
            }));
            // console.log(this.state.coorList)
            // console.log(this.state.displayedCoordinates)
        });
        emitter.on('DELETE_EVENT_IN_MAP', position => {
            this.setState(prevState => ({
                displayedCoordinates: prevState.displayedCoordinates.filter(coor => !(coor.lat === position.position.lat && coor.lng === position.position.lng))
            }));
        });
        emitter.on('CHECK_EXIST', data => {
            if (data === 0) {
                this.setState({
                    exist: true,
                    countAddCoor: 0,
                    coordinates: [],
                    displayedCoordinates: [],
                    coor: { lat: 0, lng: 0 },
                    coorList: [],
                })
                emitter.emit('NUMBER_POINT_IN_MAP', this.state.countAddCoor);
                // console.log('data', this.state.countAddCoor)
            } else {
                this.setState({
                    countAddCoor: 0,
                    coordinates: [],
                    displayedCoordinates: [],
                    coor: { lat: 0, lng: 0 },
                    coorList: [],
                    stt: data[0].start,

                })
                let i = 0;
                for (i; i < data.length; i++) {
                    this.setState({
                        exist: false,
                        countAddCoor: i + 1,
                        coordinates: [...this.state.coordinates, `Coordinate ${this.state.countAddCoor}`]
                    })
                    emitter.emit('NUMBER_POINT_IN_MAP', this.state.countAddCoor);

                }


            }
            // console.log('false', data[0].start)
            // console.log('false1', this.state.stt)
            const checkbox = document.querySelector('.form-check-input');
            if (checkbox && this.state.exist === false) {
                checkbox.checked = data[0].round;
                checkbox.disabled = true
            } else {
                checkbox.disabled = false
            }
        });
        emitter.on('RECEIVE_FROM_ESP', data => {
            // console.log(data)
            const { value_1, value_2, value_3, value_4, course, distance, speed, value_5 } = data.data.data.users;
            this.setState({
                vl: { 1: value_1, 2: value_2, 3: value_3, 4: value_4, 5: value_5, 6: course, 7: distance, 8: speed },
            })
        });
    }

    handleUserDropDown = () => {
        this.setState({
            dropdown: !this.state.dropdown,
        })
        // console.log('event in header:', this.state.dropdown)
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
            menuBar: !this.state.menuBar,
        })
    }

    handleCloseAnalysis = () => {
        this.setState({
            menuBar: !this.state.menuBar,
            Analysis: !this.state.Analysis,
        })
    }

    handleShowList = () => {
        this.setState({
            isShowList: !this.state.isShowList
        })
    }



    handleCloseMenuBar = () => {
        this.setState({
            menuBar: !this.state.menuBar
        })
    }

    addCoorBut = () => {
        if (this.state.exist === true) {
            if (this.state.countAddCoor < 15) {
                this.setState({
                    countAddCoor: ++this.state.countAddCoor,
                    coordinates: [...this.state.coordinates, `Coordinate ${this.state.countAddCoor}`] // Add a new coordinate to the array
                })
                // console.log("New coordinates:", this.state.countAddCoor);
                emitter.emit('NUMBER_POINT_IN_MAP', this.state.countAddCoor);
            }
        } else {
            alert('The USV is running but editing function is under development. So if the USV has a problem please press the stop button and call a technician')
        }

        // console.log(this.state.displayedCoordinates)

    }

    delCoorBut = (index) => {
        if (this.state.exist === true) {
            const { countAddCoor, coordinates, displayedCoordinates } = this.state;
            if (countAddCoor > 0) {
                const newCoordinates = [...coordinates];
                newCoordinates.splice(index, 1);
                this.setState({
                    countAddCoor: countAddCoor - 1,
                    coordinates: newCoordinates
                }, () => {
                    // The setState function is asynchronous, so we need to use a callback
                    // to make sure that we are working with the updated state.
                    emitter.emit('NUMBER_POINT_IN_MAP', countAddCoor - 1);
                    if (displayedCoordinates[index] && displayedCoordinates[index].lat && displayedCoordinates[index].lng) {
                        emitter.emit('DELETE_EVENT_IN_HOME', { position: displayedCoordinates[index] });
                    }
                });
            }
        } else {
            alert('The USV is running but editing function is under development. So if the USV has a problem please press the stop button and call a technician')
        }

        // console.log(this.state.displayedCoordinates)
    }

    handleStartUsv = async () => {
        if (this.state.exist === true) {
            emitter.emit('SENDING_DATA',);
            await this.setState({
                stt: '1'
            })
            // console.log(this.state.displayedCoordinates.length)
            if (this.state.displayedCoordinates.length) {
                try {
                    for (let i = 0; i < this.state.displayedCoordinates.length; i++) {
                        let data = await createCoor(this.state.displayedCoordinates[i].lat, this.state.displayedCoordinates[i].lng, this.state.stt, this.state.round);
                    };
                    emitter.emit('SENT_DATA',);
                } catch (error) {
                    console.log(error)
                }
            } else {
                alert('Please input coordinates before start')
            }
        } else {
            await this.setState({
                stt: '1'
            })
            try {
                await changeStatus(this.state.stt);

            } catch (error) {
                console.log(error)
            }
            // console.log(this.state.stt);
            // console.log(this.state.exist)
        }

    }

    handleEditUsv = async () => {
        if (this.state.exist === false) {
            alert('The USV is running but editing function is under development. So if the USV has a problem please press the stop button and call a technician')

        }
    }

    handleStopUsv = async () => {
        if (this.state.stt === 1) {
            await this.setState({
                stt: '0'
            }, async () => {

                try {
                    await changeStatus(this.state.stt);

                } catch (error) {
                    console.log(error)
                }
                // console.log(this.state.stt);
                // console.log(this.state.exist)
            });
        } else {
            alert('USV is stopping now')
        }

        // console.log(this.state.stt)

    }

    handleAround = (event) => {
        this.setState({
            round: !this.state.round
        })
    }

    handleAnalysis = () => {
        this.setState({
            Analysis: !this.state.Analysis,
            menuBar: !this.state.menuBar,
        })
        // console.log(this.state.setting)

    }

    handleSpeed = (e) => {
        this.setState({
            speed: e.target.value
        })

    }
    // handleOnChangeRadius = (event) => {
    //     let value = event.target.value;

    //     // Check if the first character is a dot
    //     if (value.charAt(0) === '.') {
    //         value = '0' + value; // Add leading 0
    //     }
    //     // Check if the last character is a dot
    //     if (value.charAt(value.length - 1) === '.') {
    //         value += '0'; // Add trailing 0
    //     }
    //     this.setState({
    //         radius: value
    //     }, () => {
    //         emitter.emit('SET_RADIUS', this.state.radius);
    //     }
    //     )
    // }

    render() {
        const { countAddCoor, coordinates, displayedCoordinates } = this.state; // Destructure state variables for easier access in the render method
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
                                                        onClick={() => { this.handleAnalysis() }}>
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
                                                    <div className="accordion-body" style={{ height: "416px" }} >

                                                        <ul className="list-group list-group-flush d-flex settingcoor" id="lstUnv" style={{ height: "388px", overflowY: "auto" }}>
                                                            <li className='pb-2 navbar navbar-fixed-top green child-nav' style={{ position: 'sticky', top: 0, zIndex: 1, background: "white" }}>
                                                                <button type="button" className="btn btn-primary  addnewcoor"
                                                                    onClick={() => {
                                                                        // console.log("Add button clicked");
                                                                        this.addCoorBut()
                                                                    }}>
                                                                    <i className="fas fa-plus"></i> Add new coordinates
                                                                </button>
                                                            </li>
                                                            {coordinates.map((item, index) => (
                                                                <li className="list-group-item displayoptioncoor" key={index}>
                                                                    #{index + 1}
                                                                    <i className="fas fa-trash-alt p-2 deletebut"
                                                                        onClick={() => {
                                                                            // console.log("Deleting coordinate at index", index);
                                                                            this.delCoorBut(index)
                                                                        }}></i>
                                                                    <form>
                                                                        <div className="form-group d-flex mb-1">
                                                                            <label className='disLat'>Lat: </label>
                                                                            <input type="text" className="form-control" placeholder="Input Latitude" value={displayedCoordinates[index]?.lat || ""} readOnly />
                                                                        </div>
                                                                        <div className="form-group d-flex">
                                                                            <label className='disLng'>Lng: </label>
                                                                            <input type="text" className="form-control" placeholder="Input Longitude" value={displayedCoordinates[index]?.lng || ''} readOnly />
                                                                        </div>
                                                                    </form>
                                                                </li>
                                                            ))}

                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* </div> */}
                                    <div>
                                        {/* <div className="form-group d-flex mb-1 ipraci">
                                            <label className='laipraci'>Circle: </label>
                                            <input type="number" className="form-control" placeholder="Input radius"
                                                min="0"
                                                onKeyPress={(event) => {
                                                    const keyCode = event.keyCode || event.which;
                                                    const keyValue = String.fromCharCode(keyCode);
                                                    const validRegex = /^[\d.]+$/;
                                                    if (!validRegex.test(keyValue)) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                                onChange={(event) => this.handleOnChangeRadius(event)} />
                                        </div> */}
                                        <div className="form-check"
                                            onChange={(event) => { this.handleAround(event) }}>
                                            <input type="checkbox" className="form-check-input " />
                                            <label className="form-check-label">go around</label>
                                        </div>
                                        {/* <div>
                                            Speed control
                                            <RangeSlider
                                                value={this.state.speed}
                                                onChange={(e) => {
                                                    this.handleSpeed(e.target.value)
                                                }}
                                                step={1}
                                                min={13}
                                                max={20}
                                            />
                                        </div>   */}
                                        {/* <Step /> */}
                                        <button type="button"
                                            className="btn btn-outline-primary startbut"
                                            onClick={(event) => {
                                                this.state.exist ? this.handleStartUsv(event) : (this.state.stt ? this.handleEditUsv(event) : this.handleStartUsv(event))
                                            }}
                                        >
                                            {this.state.exist ? "Start" : (this.state.stt ? "Edit" : "Start")}
                                        </button>
                                        <button type="button" className="btn btn-outline-danger stopbut"
                                            onClick={(event) => { this.handleStopUsv(event) }}>
                                            Stop
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* Analysis panel */}
                            <div className={this.state.Analysis ? "visible left-panel" : 'invisible left-panel'}>
                                <div className="card-body accordion-body" style={{ height: "416px" }}>
                                    <h5 className="card-title">
                                        Analysis
                                        <i className="fas fa-arrow-left"
                                            style={{
                                                float: 'right',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => { this.handleCloseAnalysis() }}
                                        ></i>
                                        <form>
                                            <div class="form-group row">
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
                                        </form>
                                    </h5>
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

// const Step = () => {

//     const [value, setValue] = React.useState(0);
//     emitter.on('CHECK_EXIST', () => {
//         setInterval(async () => {
//             try {
//                 await changeSpeed(value);

//             } catch (error) {
//                 console.log(error)
//             }
//         }, 200)

//     })


//     return (
//         <div>
//             Speed control
//             <RangeSlider
//                 value={value}
//                 onChange={e => setValue(e.target.value)}
//                 step={1}
//                 min={13}
//                 max={20}
//             />
//         </div>

//     );

// };

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
