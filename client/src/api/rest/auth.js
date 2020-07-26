import http from '../index';
import {clearStorage, setTokens} from '../../utils';

const authenticateUser = async (url, data) => {
    try {
        const response = await http.post( url, data );
        const { data: { tokenPair: {accessToken, refreshToken} } } = response;
        setTokens(accessToken, refreshToken);
        return response;
    } catch (e) {
        clearStorage();
        throw e;
    }
};

export const registerRequest = async data => authenticateUser( 'registration', data );
export const loginRequest = async data => authenticateUser( 'login', data );
export const loginUserByRefreshToken = async data => authenticateUser( 'refreshLogin', data);

export const refreshTokens = data => http.post('refreshTokens', data);
export const logout = data => http.post('logout', data);