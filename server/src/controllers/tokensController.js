const jwt = require('jsonwebtoken');
const constants = require('../constants/constants');
const bd = require('../models');
const {prepareUserToSending} = require('../utils/functions');
const AuthorizationError = require('../errors/AuthorizationError');
const AuthenticationTimeoutError = require('../errors/AuthenticationTimeoutError');
const util = require('util');

const sign = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify);

module.exports.signRefreshToken = async (req, res, next) => {
    try {
        const {user: {id}} = req;
        req.refreshTokenValue = await sign({userId: id}, constants.JWT_SECRET, {
            expiresIn: constants.REFRESH_TOKEN_TIME,
        });
        next();
    } catch (e) {
        next(e);
    }
};
module.exports.signAccessToken = async (req, res, next) => {
    try {
        const {user} = req;
        req.accessTokenValue = await sign(prepareUserToSending(user), constants.JWT_SECRET, {
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
            return next();
        } else {
            return next(new AuthorizationError());
        }
    } catch (e) {
        next(new AuthenticationTimeoutError());
    }
};

module.exports.findRefreshToken = async (req, res, next) => {
    try {
        const {
            body: {refreshToken: refreshTokenValue}, refreshTokenPayload: {userId}
        } = req;
        req.refreshToken = await bd.RefreshToken.findOne({
            where: {
                value: refreshTokenValue,
                userId,
            }
        });
        if (req.refreshToken) {
            return next();
        }
        next(new AuthorizationError());
    } catch (e) {
        next(new AuthorizationError());
    }
};

module.exports.getUserByRefreshToken = async (req, res, next) => {
    try {
        const user = await req.refreshToken.getUser();
        if (user) {
            req.user = user.get();
            return next();
        }
        next( new AuthorizationError() );
    } catch (e) {
        next( new AuthorizationError() );
    }
};

module.exports.updateRefreshToken = async (req, res, next) => {
    try {
        const { refreshToken, refreshTokenValue } = req;
        const updatedRefreshToken = await refreshToken.update( {
            value: refreshTokenValue
        } );

        if (updatedRefreshToken) {
            return next();
        }
        next( new AuthorizationError() );
    } catch (e) {
        next( new AuthorizationError() );
    }
};

module.exports.saveRefreshToken = async (req, res, next) => {
    try {
        const {refreshTokenValue, user: {id}} = req;
        const refreshToken = await bd.RefreshToken.create( {
            value: refreshTokenValue,
            userId: id,
        } );

        if (refreshToken) {
            return next();
        }
        next( new AuthorizationError() );
    } catch (e) {
        next( e );
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