import React from 'react';
import PropTypes from 'prop-types';

const BlockMessage = ({className, userId, conversationData: {blackList, participants}}) => {

    const renderMessage = () => {
        const userIndex = participants.indexOf(userId);
        if (blackList[userIndex]) {
            return 'You block him';
        } else if (blackList.includes(true)) {
            return 'He block you';
        }
    };

    return (
        <span className={className}>{renderMessage()}</span>
    );
};

BlockMessage.propTypes = {
    className: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    conversationData: PropTypes.object.isRequired,
};

export default BlockMessage;