import axios from "axios"


const handleLogin = (email, password) => {
    return axios.post('http://localhost:8080/api/login', { email, password });
}

export { handleLogin }