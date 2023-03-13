import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUser } from '../../services/userService';


class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: []
        }
    }

    async componentDidMount() {
        let response = await getAllUser('ALL');
        // console.log('get all user', response.data.users)
        if (response && response.data.errCode === 0) {
            this.setState({
                arrUsers: response.data.users
            })
        }
    }


    render() {
        // console.log('1', this.state)
        let arrUser = this.state.arrUsers;
        return (
            <div>
                <section>
                    {/* <!--for demo wrap--> */}
                    <h1>Manage user table</h1>
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
                                    console.log('checkmap', item, index)
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
                                                    <button type="submit" id="end-editing">
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
