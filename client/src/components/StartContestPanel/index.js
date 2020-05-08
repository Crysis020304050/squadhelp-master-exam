import React from 'react';
import {Link} from 'react-router-dom';
import styles from './StartContestPanel.module.sass';
import Icon from '@mdi/react'
import { mdiLightbulbOutline } from '@mdi/js';

const StartContestPanel = props => {

    return (
      <div className={styles.container}>
          <span>Ready to get started? Launch a contest and start receiving submissions instantly.</span>
          <Link to='startContest' className={styles.startContestButton}>
              <Icon path={mdiLightbulbOutline} size={0.9}/>
              <span>Start a contest</span>
          </Link>
      </div>
    );
};

export default StartContestPanel;