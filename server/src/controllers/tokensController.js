const jwt = require('jsonwebtoken');
const constants = require('../constants/constants');
const {prepareUserToSending} = require('../utils/functions');
const AuthorizationError = require('../errors/AuthorizationError');
const AuthenticationTimeoutError = require('../errors/AuthenticationTimeoutError');
const tokenQueries = require('./queries/tokensQueries');
const util = require('util');

const sign = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify);

module.exports.signRefreshToken = async (req, res, next) => {
    try {
        const {user, refreshTokenPayload} = req;
        req.refreshTokenValue = await sign(prepareUserToSending(user || refreshTokenPayload), constants.JWT_SECRET, {
            expiresIn: constants.REFRESH_TOKEN_TIME,
        });
        next();
    } catch (e) {
        next(e);
    }
};
module.exports.signAccessToken = async (req, res, next) => {
    try {
        const {user, refreshTokenPayload} = req;
        req.accessTokenValue = await sign(prepareUserToSending(user || refreshTokenPayload), constants.JWT_SECRET, {
            expiresIn: constants.ACCESS_TOKEN_TIME,
        });
        next();
    } catch (e) {
        next(e);
    }
};

module.exports.verifyRefreshToken = async (req, res, next) => {
    try {
        const {body: {refreshToken}} = req;
        req.refreshTokenPayload = await verify(refreshToken, constants.JWT_SECRET);
        next();
    } catch (e) {
        next(new AuthorizationError());
    }
};

module.exports.verifyAccessToken = async (req, res, next) => {
    try {
        const accessToken = req.body.token || req.headers.authorization;
        if (accessToken) {
            req.tokenData = await verify(accessToken, constants.JWT_SECRET);
            next();
        } else {
            next(new AuthorizationError());
        }
    } catch (e) {
        next(new AuthenticationTimeoutError());
    }
};

module.exports.findRefreshToken = async (req, res, next) => {
    try {
        const {body: {refreshToken: value}, refreshTokenPayload: {id: userId}} = req;
        req.refreshToken = await tokenQueries.findRefreshToken({
            value,
            userId,
        });
        next();
    } catch (e) {
        next(e);
    }
};

module.exports.getUserByRefreshToken = async (req, res, next) => {
    try {
        const {refreshToken} = req;
        req.user = await tokenQueries.getUserByTokenModel(refreshToken);
        next();
    } catch (e) {
        next(e);
    }
};

module.exports.updateRefreshToken = async (req, res, next) => {
    try {
        const { refreshToken, refreshTokenValue: value } = req;
        await tokenQueries.updateRefreshTokenByModel(refreshToken, {
            value,
        });
        next();
    } catch (e) {
        next(e);
    }
};

module.exports.saveRefreshToken = async (req, res, next) => {
    try {
        const {refreshTokenValue: value, user: {id: userId}} = req;
        await tokenQueries.createRefreshToken({
            value,
            userId,
        });
        next();
    } catch (e) {
        next(e);
    }
};

module.exports.generateTokenWithNewPassword = async (req, res, next) => {
    try {
        const {user, hashPass} = req;
        req.accessToken = await sign({
            id: user.id,
            newPassword: hashPass,
        }, constants.JWT_SECRET, {expiresIn: 60 * 60 * 24});
        next();
    } catch (e) {
        next(e);
    }
};

module.exports.deleteRefreshToken = async (req, res, next) => {
    try {
        const {body: {refreshToken: value}, refreshTokenPayload: {id: userId}} = req;
        await tokenQueries.deleteRefreshToken({
            value,
            userId,
        });
        res.end();
    } catch (e) {
        next(e);
    }
};