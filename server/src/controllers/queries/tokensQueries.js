const db = require('../../models');
const AuthorizationError = require('../../errors/AuthorizationError');

module.exports.createRefreshToken = async (data) => {
    const token = await db.RefreshToken.create(data);
    if (token) {
        return token;
    }
    throw new AuthorizationError();
};

module.exports.findRefreshToken = async (predicate) => {
    const token = await db.RefreshToken.findOne({where: predicate});
    if (token) {
        return token;
    }
    throw new AuthorizationError();
};

module.exports.updateRefreshTokenByModel = async (tokenModel, data) => {
    const updatedToken = await tokenModel.update(data);
    if (updatedToken) {
        return updatedToken;
    }
    throw new AuthorizationError();
};

module.exports.getUserByTokenModel = async (tokenModel) => {
    const user = await tokenModel.getUser();
    if (user) {
        return user.get();
    }
    throw new AuthorizationError();
};

module.exports.deleteRefreshToken = async (predicate) => {
    const deletedRowCount = await db.RefreshToken.destroy({where: predicate});
    if (deletedRowCount) {
        return;
    }
    throw new AuthorizationError();
};