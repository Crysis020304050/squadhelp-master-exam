import React from 'react';
import {getUserAction} from '../../actions/actionCreator';
import {connect} from 'react-redux';
import Spinner from '../Spinner/Spinner';
import constants from "../../constants";


const PrivateHoc = (Component, props) => {

    const mapStateToProps = (state) => {
        return state.userStore;
    };

    const mapDispatchToProps = (dispatch) => {
        return {
            getUser: (data) => dispatch(getUserAction(data))
        }
    };

    class Hoc extends React.Component {
        componentDidMount() {
            if (!this.props.data) {
                this.props.getUser(this.props.history.replace);
            }
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            const {data, match, history} = this.props;
            if (data && data.role === constants.MODERATOR && !constants.MODERATOR_ACCEPTED_PAGES.some(elem => elem === match.path)) {
                history.replace('/dashboard');
            }
        }

        render() {
            return (<>
                {this.props.isFetching ? <Spinner/> :
                    <Component history={this.props.history} match={this.props.match} {...props}/>}
            </>)
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(Hoc);
};


export default PrivateHoc;
