import React, {lazy, Suspense, useEffect} from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import './App.css';
import PrivateHoc from './components/PrivateHoc/PrivateHoc';
import NotFound from './components/NotFound/NotFound';
import OnlyNotAuthorizedUserHoc from './components/OnlyNotAuthorizedUserHoc/OnlyNotAuthorizedUserHoc';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import constants from './constants';
import browserHistory from './browserHistory';
import ChatContainer from './components/Chat/ChatComponents/ChatContainer/ChatContainer';
import {authActionRequest} from './actions/actionCreator';
import {connect} from 'react-redux';
import SpinnerLoader from "./components/Spinner/Spinner";

const Home = lazy(() => import('./pages/Home/Home'));
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage/RegistrationPage'));
const Payment = lazy(() => import('./pages/Payment/Payment'));
const StartContestPage = lazy(() => import('./pages/StartContestPage/StartContestPage'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const ContestPage = lazy(() => import('./pages/ContestPage/ContestPage'));
const UserProfile = lazy(() => import('./pages/UserProfile/UserProfile'));
const ContestCreationPage = lazy(() => import('./pages/ContestCreation/ContestCreationPage'));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const ConfirmPasswordResettingPage = lazy(() => import("./pages/ConfirmPasswordResettingPage"));

const App = ({getUser}) => {

    useEffect(() => {
        const refreshToken = localStorage.getItem(constants.REFRESH_TOKEN);
        if (refreshToken) {
            getUser({refreshToken});
        }
    });

    return (
        <Router history={browserHistory}>
            <Suspense fallback={SpinnerLoader}>
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={true}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover
                />
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route exact path='/howItWorks' component={HowItWorksPage}/>
                    <Route exact path='/login' component={OnlyNotAuthorizedUserHoc(LoginPage)}/>
                    <Route exact path='/registration' component={OnlyNotAuthorizedUserHoc(RegistrationPage)}/>
                    <Route exact path='/resetPassword' component={OnlyNotAuthorizedUserHoc(ResetPasswordPage)}/>
                    <Route exact path='/confirmPasswordResetting/:token'
                           component={OnlyNotAuthorizedUserHoc(ConfirmPasswordResettingPage)}/>
                    <Route exact path='/payment' component={PrivateHoc(Payment)}/>
                    <Route exact path='/startContest' component={PrivateHoc(StartContestPage)}/>
                    <Route exact path='/startContest/nameContest'
                           component={PrivateHoc(ContestCreationPage, {
                               contestType: constants.NAME_CONTEST,
                               title: 'Company Name'
                           })}/>
                    <Route exact path='/startContest/taglineContest'
                           component={PrivateHoc(ContestCreationPage, {
                               contestType: constants.TAGLINE_CONTEST,
                               title: 'TAGLINE'
                           })}/>
                    <Route exact path='/startContest/logoContest'
                           component={PrivateHoc(ContestCreationPage, {
                               contestType: constants.LOGO_CONTEST,
                               title: 'LOGO'
                           })}/>
                    <Route exact path='/dashboard' component={PrivateHoc(Dashboard)}/>
                    <Route exact path='/contest/:id' component={PrivateHoc(ContestPage)}/>
                    <Route exact path='/account' component={PrivateHoc(UserProfile)}/>
                    <Route exact path='/transactions' component={PrivateHoc(TransactionsPage)}/>
                    <Route exact path='/events' component={PrivateHoc(EventsPage)}/>
                    <Route component={NotFound}/>
                </Switch>
                <ChatContainer/>
            </Suspense>
        </Router>
    );
};

const mapDispatchToProps = dispatch => ({
    getUser: (data) => dispatch(authActionRequest(data)),
});

export default connect(null, mapDispatchToProps)(App);


