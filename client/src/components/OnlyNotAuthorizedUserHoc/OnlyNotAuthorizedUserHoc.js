import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import Spinner from '../Spinner/Spinner';

const OnlyNotAuthorizedUserHoc = (Component) => {

    const mapStateToProps = state => state.userStore;

    const Hoc = ({data, history, match, isFetching}) => {

        useEffect(() => {
            if (data) {
                history.replace('/');
            }
        });

        return (
            <>
                {
                    !data && !isFetching
                    ? <Component history={history} match={match}/>
                    : <Spinner/>
                }
            </>
        );

    };

    return connect(mapStateToProps)(Hoc);
};

export default OnlyNotAuthorizedUserHoc;
