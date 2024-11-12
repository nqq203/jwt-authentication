import axios from 'axios';

console.log(process.env.REACT_APP_API_BASE_URL)
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

api.interceptors.request.use(
  config => {
    config.headers['authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default api;
