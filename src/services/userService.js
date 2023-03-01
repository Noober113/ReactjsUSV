import axios from "axios"


const handleLogin = () => {
    return axios.post('/api/login');
}

export { handleLogin }