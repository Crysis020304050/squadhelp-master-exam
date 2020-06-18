import React from 'react';
import {connect} from 'react-redux';
import Chat from '../Chat/Chat';

const ChatContainer = ({data}) => (
    <>
        {data? <Chat/> : null}
    </>
);

const mapStateToProps = (state) => {
    const {data} = state.userStore;
    return {data};
};

export default connect(mapStateToProps, null)(ChatContainer);

