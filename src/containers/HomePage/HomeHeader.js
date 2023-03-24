import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formatDiagnosticsWithColorAndContext } from 'typescript';
import './HomeHeader.scss';


class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdown: false,
            menuBar: false,
        }
    }

    handleUserDropDown = () => {
        this.setState({
            dropdown: !this.state.dropdown,
        })
        console.log('event:', this.state.dropdown)
    }

    handleMenuBar = () => {
        this.setState({
            menuBar: !this.state.menuBar,
        })
        console.log('event:', this.state.menuBar)
    }

    render() {
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
                </div>
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
                                            href="#">
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
                                            onClick={() => { this.handleMenuBar() }}>
                                            <i className="fas fa-sign-out-alt fa-rotate-180"></i>
                                            <span>Close</span></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
