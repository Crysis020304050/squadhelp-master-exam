import React from "react";
import styles from './GetInTouchPanel.module.sass';

const GetInTouchPanel = props => {
    return (
        <div className={styles.getInTouchPanelWrapper}>
            <div className={styles.getInTouchPanel}>
                <div className={styles.iconWrapper}>
                    <i className="far fa-envelope" aria-hidden="true"/>
                </div>
                <div className={styles.getInTouchPanelText}>
                    <h5>Questions?</h5>
                    <p>Check out our <a href=''>FAQs</a> or send us a <a href=''>message</a>. For assistance with launching a contest, you can also call us at (877) 355-3585 or schedule a <a href=''>Branding Consultation</a></p>
                </div>
                <div className={styles.getInTouchPanelButton}>Get In Touch</div>
            </div>
        </div>
    );
};

export default GetInTouchPanel;