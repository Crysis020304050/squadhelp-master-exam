import React from 'react';
import constants from "../../constants";

const OnlyNotAuthorizedUserHoc = (Component) => {

    class HocForLoginSignUp extends React.Component {
        componentDidMount() {
            if (localStorage.getItem(constants.ACCESS_TOKEN)) {
                this.props.history.replace('/');
            }
        }

        render() {
            if (!localStorage.getItem(constants.ACCESS_TOKEN)) {
                return <Component history={this.props.history} match={this.props.match}/>
            }
            return null;
        }
    }

    return HocForLoginSignUp;
};

export default OnlyNotAuthorizedUserHoc;
