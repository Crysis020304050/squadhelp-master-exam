import React from 'react';
import {Link} from 'react-router-dom';
import styles from './StartContestPanel.module.sass';
import {connect} from 'react-redux';
import Icon from '@mdi/react'
import { mdiLightbulbOutline } from '@mdi/js';

const StartContestPanel = ({data}) => {

    return (
      <div className={styles.container}>
          <span>Ready to get started? Launch a contest and start receiving submissions instantly.</span>
          <Link to={data ? 'startContest' : 'login'} className={styles.startContestButton}>
              <Icon path={mdiLightbulbOutline} size={0.9}/>
              <span>Start a contest</span>
          </Link>
      </div>
    );
};

const mapStateToProps = state => state.userStore;

export default connect(mapStateToProps)(StartContestPanel);