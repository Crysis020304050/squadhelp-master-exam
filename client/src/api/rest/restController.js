import http from '../index';

export const getUser = () => http.post('getUser');
export const updateContest = data => http.post('updateContest', data);
export const setNewOffer = data => http.post('setNewOffer', data);
export const setOfferStatus = data => http.post('setOfferStatus', data);
export const downloadContestFile = (data) => http.get('downloadFile/' + data.fileName);
export const payMent = (data) => http.post('pay', data.formData);
export const changeMark = (data) => http.post('changeMark', data);
export const dataForContest = (data) => http.post('dataForContest', data);
export const cashOut = (data) => http.post('cashout', data);
export const updateUser = (data) => http.post('updateUser', data);
export const getPreview = () => http.post('getPreview');
export const getConversation = (data) => http.post('getConversation', data);
export const newMessage = (data) => http.post('newMessage', data);
export const changeChatFavorite = (data) => http.post('changeFavoriteUserStatus', data);
export const changeChatBlock = (data) => http.post('changeBlockedUserStatus', data);
export const getCatalogList = (data) => http.post('getCatalogs', data);
export const addConversationToCatalog = (data) => http.post('addNewConversationToCatalog', data);
export const createCatalog = (data) => http.post('createCatalog', data);
export const deleteCatalog = (data) => http.post('deleteCatalog', data);
export const removeConversationFromCatalog = (data) => http.post('removeConversationFromCatalog', data);
export const changeCatalogName = (data) => http.post('updateNameCatalog', data);

export const getCustomersContests = ({limit, offset, contestStatus}) => (
    http.post('getCustomersContests', {limit, offset}, {headers: {status: contestStatus}})
);

export const getActiveContests = ({offset, limit, selectedContestTypes, contestId, industry, awardSort, ownEntries, moderationStatus}) => (
    http.post('getContestsForCreative', {
        offset,
        limit,
        selectedContestTypes,
        contestId,
        industry,
        awardSort,
        ownEntries,
        moderationStatus
    })
);

export const getContestForModerator = ({offset, limit, moderationStatus}) => (
    http.post('getContestsForModerator', {offset, limit, moderationStatus})
);

export const getContestById = ({contestId}) => (
    http.get('getContestById', {headers: {contestId,}
}));

export const getUserTransactionsHistory = () => http.get('getUserTransactionsHistory');
export const getUserTransactionsStatement = () => http.get('getUserTransactionsStatement');
export const resetUserPasswordRequest = (data) => http.post('resetUserPasswordRequest', data);
export const confirmPasswordResetting = (data) => http.post('confirmPasswordResetting', data);
export const resolveContest = (id) => http.post('resolveContest', {id});
export const rejectContest = (id) => http.post('rejectContest', {id});

export const getOffersForModerator = ({offset, limit, moderationStatus}) => (
    http.post('getOffersForModerator', {offset, limit, moderationStatus})
);

export const resolveOffer = (id) => http.post('resolveOffer', {id});
export const rejectOffer = (id) => http.post('rejectOffer', {id});
export const createNewEvent = (data) => http.post('createEvent', data);
export const getUserEvents = () => http.get('getUserEvents');



