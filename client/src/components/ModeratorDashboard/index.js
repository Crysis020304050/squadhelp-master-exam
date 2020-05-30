import React, {useState} from "react";
import styles from './ModeratorDashboard.module.sass';
import constants from "../../constants";
import PropTypes from 'prop-types';
import ContestsModerationSpace from "../ContestsModerationSpace";
import OffersModerationSpace from "../OffersModerationSpace";
import Select from 'react-select';

const ModeratorDashboard = ({history}) => {

    const moderationSpaces = [
        {
            value: constants.MODERATION_CONTESTS_SPACE,
            label: 'Contests Moderation',
        },
        {
            value: constants.MODERATION_OFFERS_SPACE,
            label: 'Offers Moderation',
        },
    ];

    const [moderationSpace, setModerationSpace] = useState(moderationSpaces[0]);

    const getModerationSpace = () => {
        switch (moderationSpace.value) {
            case constants.MODERATION_CONTESTS_SPACE: {
                return <ContestsModerationSpace history={history}/>
            }
            case constants.MODERATION_OFFERS_SPACE: {
                return <OffersModerationSpace/>
            }
            default: {
                return null;
            }
        }
    };

    return (
        <div className={styles.mainContainer}>
            <Select className={styles.selectContainer} value={moderationSpace} onChange={setModerationSpace} options={moderationSpaces}/>
            <div className={styles.contentContainer}>
                {
                    getModerationSpace()
                }
            </div>
        </div>
    );
};

ModeratorDashboard.propTypes = {
    history: PropTypes.object.isRequired,
};

export default ModeratorDashboard;