import http from '../index';

export const refreshTokens = data => http.post('refreshTokens', data);
export const getUser = () => http.post('getUser');
export const updateContest = data => http.post('updateContest', data);
export const setNewOffer = data => http.post('setNewOffer', data);
export const setOfferStatus = data => http.post('setOfferStatus', data);
export const downloadContestFile = (data) => http.get('downloadFile/' + data.fileName);
export const payMent = (data) => http.post('pay', data.formData);
export const changeMark = (data) => http.post('changeMark', data);
//export const getPreviewChat = () => http.post('getPreview');
export const getPreviewChat = () => http.post('getPreviewPostgres');
export const getDialog = (data) => http.post('getChat', data);
export const dataForContest = (data) => http.post('dataForContest', data);
export const cashOut = (data) => http.post('cashout', data);
export const updateUser = (data) => http.post('updateUser', data);
export const newMessage = (data) => http.post('newMessage', data);
export const changeChatFavorite = (data) => http.post('favorite', data);
export const changeChatBlock = (data) => http.post('blackList', data);
export const getCatalogList = (data) => http.post('getCatalogs', data);
export const addChatToCatalog = (data) => http.post('addNewChatToCatalog', data);
export const createCatalog = (data) => http.post('createCatalog', data);
export const deleteCatalog = (data) => http.post('deleteCatalog', data);
export const removeChatFromCatalog = (data) => http.post('removeChatFromCatalog', data);
export const changeCatalogName = (data) => http.post('updateNameCatalog', data);
export const getCustomersContests = (data) => {
    return http.post('getCustomersContests', {limit: data.limit, offset: data.offset}, {
        headers: {
            status: data.contestStatus
        }
    });
};

export const getActiveContests = ({offset, limit, selectedContestTypes, contestId, industry, awardSort, ownEntries, moderationStatus}) => {
    return http.post('getContestsForCreative', {offset, limit, selectedContestTypes, contestId, industry, awardSort, ownEntries, moderationStatus})
};

export const getContestForModerator = ({offset, limit, moderationStatus}) => {
    return http.post('getContestsForModerator', {offset, limit, moderationStatus});
};

export const getContestById = (data) => {
    return http.get('getContestById', {
        headers: {
            contestId: data.contestId
        }
    });
};

export const getUserTransactionsHistory = () => http.get('getUserTransactionsHistory');
export const getUserTransactionsStatement = () => http.get('getUserTransactionsStatement');
export const resetUserPasswordRequest = (data) => http.post('resetUserPasswordRequest', data);
export const confirmPasswordResetting = (data) => http.post('confirmPasswordResetting', data);
export const resolveContest = (id) => http.post('resolveContest', {id});
export const rejectContest = (id) => http.post('rejectContest', {id});

export const getOffersForModerator = ({offset, limit, moderationStatus}) => {
    return http.post('getOffersForModerator', {offset, limit, moderationStatus});
};

export const resolveOffer = (id) => http.post('resolveOffer', {id});
export const rejectOffer = (id) => http.post('rejectOffer', {id});



