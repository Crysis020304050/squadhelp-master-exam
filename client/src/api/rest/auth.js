import http from '../index';
import constants from '../../constants/constants';
import {clearStorage} from '../../utils';
import history from "../../browserHistory";

const authenticateUser = async (url, data) => {
    try {
        const response = await http.post( url, data );
        const { data: { tokenPair } } = response;
        sessionStorage.setItem( constants.ACCESS_TOKEN, tokenPair.accessToken );
        localStorage.setItem( constants.REFRESH_TOKEN, tokenPair.refreshToken );
        return response;
    } catch (e) {
        clearStorage();
        history.replace('/login');
        throw e;
    }
};

export const registerRequest = async data => authenticateUser( 'registration', data );
export const loginRequest = async data => authenticateUser( 'login', data );
export const loginUserByRefreshToken = async data => authenticateUser( 'refreshLogin', data);