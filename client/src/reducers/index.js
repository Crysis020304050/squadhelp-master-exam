import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import userReducer from './userReducer';
import dataForContestReducer from './dataForContestReducer';
import payReducer from './payReducer';
import getContestsReducer from './getContestsReducer';
import storeContestReducer from './storeContestReducer';
import bundleReducer from './bundleReducer';
import getContestByIdReducer from './getContestByIdReducer';
import updateContestReducer from './updateContestReducer';
import chatReducer from './chatReducer';
import userProfileReducer from './userProfileReducer';
import transactionsReducer from "./transactionsReducer";
import eventsReducer from "./eventsReducer";
import resetPasswordReducer from "./resetPasswordReducer";
import confirmPasswordResettingReducer from "./confirmPasswordResettingReducer";
import moderateContestsReducer from "./moderateContestsReducer";
import moderateOffersReducer from "./moderateOffersReducer";

const appReducer = combineReducers({
   form: formReducer,
   userStore: userReducer,
   dataForContest: dataForContestReducer,
   payment: payReducer,
   contestByIdStore: getContestByIdReducer,
   contestsList: getContestsReducer,
   contestStore: storeContestReducer,
   bundleStore: bundleReducer,
   updateContestStore: updateContestReducer,
   chatStore: chatReducer,
   userProfile: userProfileReducer,
   transactionsStore: transactionsReducer,
   eventsStore: eventsReducer,
   resetPasswordStore: resetPasswordReducer,
   confirmPasswordResettingStore: confirmPasswordResettingReducer,
   moderationContestsStore: moderateContestsReducer,
   moderationOffersStore: moderateOffersReducer,
});

export default appReducer;