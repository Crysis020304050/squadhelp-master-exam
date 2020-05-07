const bd = require('../models');
const CONSTANTS = require('../constants/constants');

module.exports.createWhereForAllContests = (
    selectedContestTypes, contestId, industry, awardSort, moderationStatus) => {
    let object = {
        where: {},
        order: [],
    };
    if (selectedContestTypes) {
        Object.assign(object.where, {contestType: getPredicateTypes([...selectedContestTypes])});
    }
    if (contestId) {
        Object.assign(object.where, {id: contestId});
    }
    if (industry) {
        Object.assign(object.where, {industry: industry});
    }
    if (awardSort) {
        object.order.push(['prize', awardSort]);
    }
    if (moderationStatus) {
        Object.assign(object.where, {moderationStatus})
    }
    Object.assign(object.where, {
        status: {
            [bd.Sequelize.Op.or]: [
                CONSTANTS.CONTEST_STATUS_FINISHED,
                CONSTANTS.CONTEST_STATUS_ACTIVE,
            ],
        },
    });
    object.order.push(['id', 'desc']);
    return object;
};

function getPredicateTypes(arrOfTypes) {
    return {[bd.Sequelize.Op.or]: arrOfTypes};
}

module.exports.prepareUserToSending = ({password, accessToken, ...rest}) => rest;