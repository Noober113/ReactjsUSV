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

export { handleLogin, getAllUser, createNewUserService }