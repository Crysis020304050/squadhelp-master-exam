import axios from 'axios';
import CONSTANTS from '../constants';
import {refreshTokens} from './rest/restController';

const instance = axios.create({
    baseURL: CONSTANTS.BASE_URL
});

instance.interceptors.request.use(config => {
    config.headers.authorization = sessionStorage.getItem(CONSTANTS.ACCESS_TOKEN);
    return config;
}, (err) => Promise.reject(err));


instance.interceptors.response.use(response => response, async err => {
    const {response: {status}, config} = err;
    switch (status) {
        case 419: {
            const {data} = await refreshTokens({
                refreshToken: localStorage.getItem(CONSTANTS.REFRESH_TOKEN)
            });
            if (data) {
                sessionStorage.setItem(CONSTANTS.ACCESS_TOKEN, data.accessToken);
                localStorage.setItem(CONSTANTS.REFRESH_TOKEN, data.refreshToken);
                return instance.request(config);
            }
        }
    }
    return Promise.reject(err);
});

export default instance;