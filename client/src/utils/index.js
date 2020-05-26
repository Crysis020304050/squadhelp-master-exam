import constants from '../constants';
import _ from "lodash";

export const clearStorage = () => {
    sessionStorage.removeItem(constants.ACCESS_TOKEN);
    localStorage.removeItem(constants.REFRESH_TOKEN);
};

export const loadDataToMap = (map, data) => {
    const updatedMap = _.clone(map);
    data.forEach(item => {
        updatedMap.set(item.id, item);
    });
    return updatedMap;
};

export const removeItemFromMap = (map, id) => {
    const updatedMap = _.clone(map);
    updatedMap.delete(id);
    return updatedMap;
};