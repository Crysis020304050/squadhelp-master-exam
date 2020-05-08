import React from "react";
import styles from './GetInTouchPanel.module.sass';
import {Link} from "react-router-dom";

const GetInTouchPanel = props => {
    return (
        <div className={styles.getInTouchPanelWrapper}>
            <div className={styles.getInTouchPanel}>
                <div className={styles.iconWrapper}>
                    <i className="far fa-envelope" aria-hidden="true"/>
                </div>
                <div className={styles.getInTouchPanelText}>
                    <h5>Questions?</h5>
                    <p>Check out our <Link to='/'>FAQs</Link> or send us a <Link to='/'>message</Link>. For assistance with launching a contest, you can also call us at (877) 355-3585 or schedule a <Link to='/'>Branding Consultation</Link></p>
                </div>
                <Link to='/' className={styles.getInTouchPanelButton}>Get In Touch</Link>
            </div>
        </div>
    );
};

export default GetInTouchPanel;