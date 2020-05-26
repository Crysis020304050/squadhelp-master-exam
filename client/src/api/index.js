import axios from 'axios';
import constants from '../constants';
import {refreshTokens} from './rest/restController';
import history from "../browserHistory";
import {clearStorage} from '../utils';

const instance = axios.create({
    baseURL: constants.BASE_URL
});

instance.interceptors.request.use(config => {
    config.headers.authorization = sessionStorage.getItem(constants.ACCESS_TOKEN);
    return config;
}, (err) => Promise.reject(err));


instance.interceptors.response.use(response => response, async err => {
    const {response: {status}, config} = err;
    switch (status) {
        case 419: {
            const {data} = await refreshTokens({
                refreshToken: localStorage.getItem(constants.REFRESH_TOKEN)
            });
            if (data) {
                sessionStorage.setItem(constants.ACCESS_TOKEN, data.accessToken);
                localStorage.setItem(constants.REFRESH_TOKEN, data.refreshToken);
                return instance.request(config);
            } else {
                clearStorage();
                history.replace('/login');
            }
            break;
        }
        case 401: {
            clearStorage();
            history.replace('/login');
            break;
        }
        default: {
            return Promise.reject(err);
        }
    }
    return Promise.reject(err);
});

export default instance;