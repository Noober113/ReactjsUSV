import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';


class ModalUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            fullName: '',
            address: '',
            phoneNumber: ''
        }
    }

    componentDidMount() {
    }

    toggle = () => {
        this.props.toggleFromParent();
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    checkValueInput = () => {
        let value = true;
        let arrInput = ['email', 'password', 'fullName', 'phoneNumber', 'address'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                value = false;
                alert('Missing' + ' ' + arrInput[i])
                break;
            }
        }
        return value;
    }

    handleAddNewUser = () => {
        let value = this.checkValueInput();
        if (value === true) {
            this.props.createNewUser(this.state);
        }
    }

    render() {
        return (
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={this.toggle}
                    className={this.props.className}
                    size="lg"
                    centered
                >
                    <ModalHeader toggle={this.toggle}>Create new user</ModalHeader>
                    <ModalBody>
                        <div class="container">
                            <div class="row">
                                <form>
                                    <div className="form-row">
                                        <Row>
                                            <Col className='mb-3'>
                                                <div className="form-group">
                                                    <label for="inputEmail4">Email</label>
                                                    <input type="email"
                                                        className="form-control"
                                                        placeholder="abc@def.xyz"
                                                        onChange={(event) => { this.handleOnChangeInput(event, "email") }}
                                                        value={this.state.email}
                                                    />
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="form-group">
                                                    <label for="inputPassword4">Password</label>
                                                    <input type="password"
                                                        className="form-control"
                                                        placeholder="Password"
                                                        onChange={(event) => { this.handleOnChangeInput(event, "password") }}
                                                        value={this.state.password}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className='mb-3'>
                                            <Col>
                                                <div className="form-group">
                                                    <label for="inputFullName">Full name</label>
                                                    <input type="text"
                                                        className="form-control"
                                                        placeholder="Your name"
                                                        onChange={(event) => { this.handleOnChangeInput(event, "fullName") }}
                                                        value={this.state.fullName}
                                                    />
                                                </div>
                                            </Col>
                                            <Col>
                                                <div class="form-group ">
                                                    <label for="inputPhoneNumber">Phone number</label>
                                                    <input type="text"
                                                        className="form-control"
                                                        placeholder="0123456789"
                                                        onChange={(event) => { this.handleOnChangeInput(event, "phoneNumber") }}
                                                        value={this.state.phoneNumber}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="form-group mb-3">
                                        <label for="inputAddress">Address</label>
                                        <input type="text"
                                            className="form-control"
                                            placeholder="Your address"
                                            onChange={(event) => { this.handleOnChangeInput(event, "address") }}
                                            value={this.state.address}
                                        />
                                    </div>

                                </form>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary px-3"
                            onClick={() => { this.handleAddNewUser() }}>
                            Create
                        </Button>{' '}
                        <Button color="secondary px-3" onClick={this.toggle}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>)
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);











