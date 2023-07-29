import axios from 'axios';
import { API_BASEURL } from '../../envVariables';

export const axiosInstance = axios.create({
  baseURL: `${API_BASEURL}/api/v1`,
  crossDomain: true,
  headers: {
    'Content-Type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-headers': '*',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(async config => {
  try {
    const jwt = JSON.parse(window.localStorage.getItem('jwt'));
    const token = jwt ? `Bearer ${jwt}` : undefined;
    config.headers.Authorization = token;
    return config;
  } catch (error) {
    window.location.replace('/admin-login');
    return null;
  }
});

axiosInstance.interceptors.response.use(
  response => {
    if (response.status === 'error') {
      return Promise.reject(response);
    }
    return response;
  },
  error => {
    if (error?.message === 'Request failed with status code 401') {
      commonLogoutFunc();
      window.location.replace('/auth/login');
    }
    return Promise.reject(error);
  }
);
