import React, {useEffect} from 'react';
import Logo from '../../components/Logo';
import RegistrationForm
    from '../../components/RegistrationForm/RegistrationForm';
import styles from './RegistrationPage.module.sass';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {clearUserError} from '../../actions/actionCreator';
import constants from '../../constants/constants';
import Article from "../../components/Article";
import articlesData from './articlesData';
import Error from "../../components/Error/Error";

const RegistrationPage = ({error, isFetching, clearError}) => {

    useEffect(() => {
        if (error) {
            clearError();
        }
    }, []);

    return (
        <div className={styles.signUpPage}>
            <div className={styles.signUpContainer}>
                <div className={styles.headerSignUpPage}>
                    <Logo src={`${constants.STATIC_IMAGES_PATH}logo.png`}/>
                    <div className={styles.linkLoginContainer}>
                        <Link to='/login'>Login</Link>
                    </div>
                </div>
                <div className={ styles.headerFormContainer }>
                    <h2>
                        CREATE AN ACCOUNT
                    </h2>
                    <h4>
                        We always keep your name and email address private.
                    </h4>
                    { error && <Error error={error} clearError={ clearError }/> }
                </div>
                <RegistrationForm isFetching={isFetching}/>
            </div>
            <div className={styles.footer}>
                <div className={styles.articlesMainContainer}>
                    <div className={styles.ColumnContainer}>
                        {
                            [articlesData[0], articlesData[1], articlesData[2]].map((article, index) => <Article
                                key={index}
                                header={article.header}
                                body={article.body}
                                bodyStyles={styles.article}
                                headerStyles={styles.headerArticle}/>
                            )
                        }
                    </div>
                    <div className={styles.ColumnContainer}>
                        {
                            [articlesData[3], articlesData[4], articlesData[5]].map((article, index) => <Article
                                key={index}
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
    )
};

const mapStateToProps = state => state.userStore;

const mapDispatchToProps = (dispatch) => ({
    clearError: () => dispatch(clearUserError()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationPage);