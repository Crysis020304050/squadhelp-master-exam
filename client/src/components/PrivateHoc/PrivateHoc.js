import React from 'react';
import {connect} from 'react-redux';
import Spinner from '../Spinner/Spinner';
import constants from "../../constants";


const PrivateHoc = (Component, props) => {

    const mapStateToProps = state => state.userStore;

    class Hoc extends React.Component {

        componentDidMount() {
            if (!localStorage.getItem(constants.ACCESS_TOKEN)) {
                this.props.history.replace('/login');
            }
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            const {data, history, match} = this.props;

            if (prevProps.isFetching === true && data === null) {
                history.replace('/login');
            }

            if (data && data.role === constants.MODERATOR && !constants.MODERATOR_ACCEPTED_PAGES.some(elem => elem === match.path)) {
                history.replace('/');
            }
        }

        render() {
            const {data, history, match} = this.props;

            return (
                <>
                    {
                        data
                            ? <Component history={history} match={match} {...props}/>
                            : <Spinner/>
                    }
                </>
            );
        }
    }

    return connect(mapStateToProps)(Hoc);
};

export default PrivateHoc;
