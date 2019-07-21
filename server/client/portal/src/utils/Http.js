import Axios from 'axios';
import { getToken } from './auth';

export const Http = Axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000
});

Http.interceptors.request.use(
  config => {
    config.headers.authorization = getToken();
    return config;
  },
  error => Promise.reject(error.response)
);

Http.interceptors.response.use(
  res => {
    console.log(res);
    return res.data;
  },
  error => Promise.reject(error.response)
);
