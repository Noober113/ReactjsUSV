import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUser, createNewUserService, deleteUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import { emitter } from '../../utils/emitter';

class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false
        }
    }

    async componentDidMount() {
        await this.getAllUserFromReact();
    }

    getAllUserFromReact = async () => {
        let response = await getAllUser('ALL');
        // console.log('get all user', response.data.users)
        if (response && response.data.errCode === 0) {
            this.setState({
                arrUsers: response.data.users
            })
        }
    }

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true,
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }

    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            if (response && response.data.errCode !== 0) {
                alert(response.data.errMessage)
            } else {
                await this.getAllUserFromReact();
                this.setState({
                    isOpenModalUser: false,
                })

                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }
        } catch (e) {
            console.log(e)
        }
    }

    handleDelete = async (user) => {
        try {
            let res = await deleteUserService(user.id)
            if (res && res.data.errCode === 0) {
                await this.getAllUserFromReact();
            }
        } catch (e) {
            console.log(e)
        }
        console.log('delete', user)
    }

    render() {
        // console.log('1', this.state)
        let arrUser = this.state.arrUsers;
        return (
            // form use: https://codepen.io/JoannaEl/pen/ZjaBvr
            <div>
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleFromParent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                <section>
                    {/* <!--for demo wrap--> */}
                    <h1>Manage user table</h1>
                    <button type="button"
                        className="btn btn-outline-secondary px-3 mb-3"
                        onClick={() => this.handleAddNewUser()}>
                        <i className="fas fa-plus"></i> Add new user</button>
                    <div className="tbl-header">
                        <table cellPadding="0" cellSpacing="0" border="0">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Fullname</th>
                                    <th>Address</th>
                                    <th>Phonenumber</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="tbl-content">
                        <table cellpadding="0" cellspacing="0" border="0">
                            <tbody>
                                {arrUser && arrUser.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.email}</td>
                                            <td>{item.fullName}</td>
                                            <td>{item.address}</td>
                                            <td>{item.phoneNumber}</td>
                                            <td>
                                                <div id="container">
                                                    <button type="submit" id="edit-button">
                                                        <i className="far fa-edit"></i>
                                                    </button>
                                                    <button type="submit"
                                                        onClick={() => { this.handleDelete(item) }}>
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                                }

                            </tbody>
                        </table>
                    </div>
                </section>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
