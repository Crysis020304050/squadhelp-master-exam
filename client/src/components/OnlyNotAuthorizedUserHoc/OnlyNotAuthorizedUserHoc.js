import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import Spinner from '../Spinner/Spinner';

const OnlyNotAuthorizedUserHoc = (Component) => {

    const mapStateToProps = state => state.userStore;

    const Hoc = ({data, history, match}) => {

        useEffect(() => {
            if (data) {
                history.replace('/');
            }
        });

        return (
            <>
                {
                    !data
                    ? <Component history={history} match={match}/>
                    : <Spinner/>
                }
            </>
        );

    };

    return connect(mapStateToProps)(Hoc);
};

export default OnlyNotAuthorizedUserHoc;
