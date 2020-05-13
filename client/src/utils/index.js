import CONSTANTS from '../constants';

export const clearStorage = () => {
    sessionStorage.removeItem(CONSTANTS.ACCESS_TOKEN);
    localStorage.removeItem(CONSTANTS.REFRESH_TOKEN);
};