import React from 'react';
import Logo from '../../components/Logo';
import RegistrationForm
    from '../../components/RegistrationForm/RegistrationForm';
import styles from './RegistrationPage.module.sass';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {clearErrorSignUpAndLogin} from '../../actions/actionCreator';
import CONSTANTS from '../../constants';
import Article from "../../components/Article";
import articlesData from './articlesData';

const RegistrationPage = (props) => {
    props.clearError();

    return (
        <div className={styles.signUpPage}>
            <div className={styles.signUpContainer}>
                <div className={styles.headerSignUpPage}>
                    <Logo src={`${CONSTANTS.STATIC_IMAGES_PATH}logo.png`}/>
                    <div className={styles.linkLoginContainer}>
                        <Link to='/login'
                              style={{textDecoration: 'none'}}><span>Login</span></Link>
                    </div>
                </div>
                <div className={ styles.headerFormContainer }>
                    <h2>
                        CREATE AN ACCOUNT
                    </h2>
                    <h4>
                        We always keep your name and email address private.
                    </h4>
                </div>
                <RegistrationForm/>
            </div>
            <div className={styles.footer}>
                <div className={styles.articlesMainContainer}>
                    <div className={styles.ColumnContainer}>
                        {
                            [articlesData[0], articlesData[1], articlesData[2]].map(article => <Article
                                header={article.header}
                                body={article.body}
                                bodyStyles={styles.article}
                                headerStyles={styles.headerArticle}/>
                            )
                        }
                    </div>
                    <div className={styles.ColumnContainer}>
                        {
                            [articlesData[3], articlesData[4], articlesData[5]].map(article => <Article
                                header={article.header}
                                body={article.body}
                                bodyStyles={styles.article}
                                headerStyles={styles.headerArticle}/>
                            )
                        }
                        <div className={styles.article}>
                            Check out our <span className={styles.orangeSpan}>FAQs</span> or
                            send us a <span
                            className={styles.orangeSpan}>message</span>. For assistance
                            with launching a contest,
                            you can also call us at (877) 355-3585 or schedule a <span
                            className={styles.orangeSpan}>Branding Consultation</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        clearError: () => dispatch(clearErrorSignUpAndLogin()),
    };
};

export default connect(null, mapDispatchToProps)(RegistrationPage);