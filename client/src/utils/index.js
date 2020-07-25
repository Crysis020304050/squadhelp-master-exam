import constants from '../constants/constants';
import _ from "lodash";
import {useEffect, useRef} from "react";

export const setTokens = (accessToken, refreshToken) => {
    sessionStorage.setItem(constants.ACCESS_TOKEN, accessToken);
    localStorage.setItem(constants.REFRESH_TOKEN, refreshToken);
};

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

export const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};