import axios from "axios"


const handleLogin = (email, password) => {
    return axios.post('http://localhost:8080/api/login', { email, password });
}

const getAllUser = (inputId) => {
    return axios.get(`http://localhost:8080/api/get-all-users?id=${inputId}`);
}

const createNewUserService = (data) => {
    return axios.post('http://localhost:8080/api/create-user', data);
}

const deleteUserService = (id) => {
    return axios.delete('http://localhost:8080/api/delete-user', {
        data: {
            id: id
        }
    });
}

const createCoor = (lat, lng) => {
    return axios.post('http://localhost:8080/api/create-coor', { lat, lng });
}

const getAllCoor = () => {
    return axios.get(`http://localhost:8080/api/get-coor`);
}

export { handleLogin, getAllUser, createNewUserService, deleteUserService, createCoor, getAllCoor }