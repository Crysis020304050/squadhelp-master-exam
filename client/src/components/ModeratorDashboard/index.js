import React, {useState} from "react";
import styles from './ModeratorDashboard.module.sass';
import constants from "../../constants";
import PropTypes from 'prop-types';
import ContestsModerationBox from "../ContestsModerationBox";
import OffersModerationBox from "../OffersModerationBox";
import Select from 'react-select';

const ModeratorDashboard = ({history}) => {

    const moderationBoxes = [
        {
            value: constants.MODERATION_CONTESTS_BOX,
            label: 'Contests Moderation',
        },
        {
            value: constants.MODERATION_OFFERS_BOX,
            label: 'Offers Moderation',
        },
    ];

    const [moderationBox, setModerationBox] = useState(moderationBoxes[0]);

    const getModerationBox = () => {
        switch (moderationBox.value) {
            case constants.MODERATION_CONTESTS_BOX: {
                return <ContestsModerationBox history={history}/>
            }
            case constants.MODERATION_OFFERS_BOX: {
                return <OffersModerationBox/>
            }
            default: {
                return null;
            }
        }
    };

    return (
        <div className={styles.mainContainer}>
            <Select className={styles.selectContainer} value={moderationBox} onChange={setModerationBox} options={moderationBoxes}/>
            <div className={styles.contentContainer}>
                {
                    getModerationBox()
                }
            </div>
        </div>
    );
};

ModeratorDashboard.propTypes = {
    history: PropTypes.object.isRequired,
};

export default ModeratorDashboard;