import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";

import './Login.scss';
import { FormattedMessage } from 'react-intl';

import adminService from '../../services/adminService';
import { handleLogin } from '../../services/userService';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            passchange: false,
            errMessage: '',
        }
    }

    handleOnChangeEmail = (event) => {
        this.setState({
            username: event.target.value
        })
        // console.log(event.target.value)
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
        // console.log(event.target.value)
    }

    handleLogin = async () => {
        this.setState({
            // clear mã lỗi
            errMessage: ''
        })
        try {
            let data = await handleLogin(this.state.username, this.state.password);

            if (data && data.data.errCode !== 0) {
                this.setState({
                    errMessage: data.data.message
                })
            }
            if (data && data.data.errCode === 0) {
                this.props.userLoginSuccess(data.user)
                console.log('success')
                console.log(data)
            }
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

    handleShowpassword = () => {
        this.setState({
            passchange: !this.state.passchange
        })
    }

    render() {
        return (
            <div className='vh-100 background'>
                {/* <div className='block'>

                </div> */}
                <div className='container col-6 tab-log'>
                    <form>
                        <div className='log-in'>
                            Log In
                        </div>
                        <div className="d-grid gap-2 d-md-block">
                            {/* <!-- Email input --> */}
                            <div className="form-outline mb-4">
                                <label className="form-label" for="form2Example1">Email address</label>
                                <input type="email"
                                    id="form2Example1"
                                    className="form-control"
                                    placeholder='Enter your email'
                                    value={this.state.username}
                                    onChange={(event) => this.handleOnChangeEmail(event)} />
                            </div>

                            {/* <!-- Password input --> */}
                            <div className="form-outline mb-4 pas">
                                <label className="form-label" for="form2Example2">Password</label>
                                <div className='change-event'>
                                    <input type={this.state.passchange ? "text" : 'password'}
                                        id="form2Example2"
                                        className="form-control"
                                        placeholder='Enter your password'
                                        onChange={(event) => this.handleOnChangePassword(event)} />
                                    <span
                                        onClick={(event) => this.handleShowpassword(event)}>
                                        <i className={this.state.passchange ? "far fa-eye eye" : "far fa-eye-slash"}></i>
                                    </span>
                                </div>

                            </div>
                            <div className='col-12' style={{ color: 'red' }}>
                                {this.state.errMessage}
                            </div>

                            {/* <!-- 2 column grid layout for inline styling --> */}
                            <div className="row mb-4">

                                <button type="button"
                                    className="btn btn-primary btn-block mb-4  button"
                                    onClick={(event) => this.handleLogin(event)}>Sign in</button>

                                <div className="for-pass">
                                    {/* <!-- Simple link --> */}
                                    <a href="#!">Forgot password?</a>
                                </div>
                            </div>
                        </div>
                        {/* <!-- Submit button --> */}

                        {/* <!-- Register buttons --> */}
                        <div className="form-outline mb-4">
                            <div className="text-center">
                                <p>Not a member? <a href="#!">Register</a></p>
                                <p>or sign up with:</p>
                                <div className='other-login'>
                                    <i className="fab fa-facebook-f facebook"></i>
                                    <i className="fab fa-google google"></i>
                                    <i className="fab fa-github github"></i>
                                </div>

                            </div>
                        </div>
                    </form>
                </div >
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        lang: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
