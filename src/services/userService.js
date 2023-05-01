import axios from "axios"
let url = process.env.REACT_APP_BACKEND_URL

const handleLogin = (email, password) => {
    return axios.post(`${url}/api/login`, { email, password });
}

const getAllUser = (inputId) => {
    return axios.get(`${url}/api/get-all-users?id=${inputId}`);
}

const createNewUserService = (data) => {
    return axios.post(`${url}/api/create-user`, data);
}

const deleteUserService = (id) => {
    return axios.delete(`${url}/api/delete-user`, {
        data: {
            id: id
        }
    });
}

const createCoor = (lat, lng, stt, round) => {
    return axios.post(`${url}/api/create-coor`, { lat, lng, stt, round });
}

const getAllCoor = () => {
    return axios.get(`${url}/api/get-coor`);
}

const changeStatus = (stt) => {
    return axios.put(`${url}/api/edit-status`, { stt });
}

const getExist = async () => {
    const response = await axios.get(`${url}/api/query-setting`);
    return response.data.checkval;
    // return axios.get(`/api/query-setting`);
}

export { handleLogin, getAllUser, createNewUserService, deleteUserService, createCoor, getAllCoor, changeStatus, getExist }