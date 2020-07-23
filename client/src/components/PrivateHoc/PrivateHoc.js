import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import Spinner from '../Spinner/Spinner';
import constants from "../../constants/constants";
import {usePrevious} from "../../utils";


const PrivateHoc = (Component, props) => {

    const mapStateToProps = state => state.userStore;

    const Hoc = ({history, data, match, isFetching}) => {

        const prevProps = usePrevious({isFetching});

        const {REFRESH_TOKEN, MODERATOR, MODERATOR_ACCEPTED_PAGES} = constants;

        useEffect(() => {

            if (!localStorage.getItem(REFRESH_TOKEN) || prevProps && prevProps.isFetching && !data) {
                history.replace('/login');
            }

            if (data && data.role === MODERATOR && !MODERATOR_ACCEPTED_PAGES.some(elem => elem === match.path)) {
                history.replace('/');
            }
        });

        return (
            <>
                {
                    data
                        ? <Component history={history} match={match} {...props}/>
                        : <Spinner/>
                }
            </>
        );
    };

    return connect(mapStateToProps)(Hoc);
};

export default PrivateHoc;
