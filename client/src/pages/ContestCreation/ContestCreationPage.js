import React, {useEffect} from 'react'
import {connect} from 'react-redux';
import styles from './ContestCreationPage.module.sass';
import {saveContestToStore, clearDataForContest} from '../../actions/actionCreator';
import NextButton from '../../components/NextButton/NextButton';
import ContestForm from '../../components/ContestForm/ContestForm';
import BackButton from '../../components/BackButton/BackButton';
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';


const ContestCreationPage = ({saveContest, bundleStore, history, contestType, title, contestStore}) => {

    useEffect(() => {
        if (!bundleStore.bundle) {
            history.replace('/startContest');
        }
    }, [bundleStore]);

    const submitDataContest = (values) => {
        saveContest({type: contestType, info: values});
        history.push(bundleStore.bundle[contestType] === 'payment' ? '/payment' : bundleStore.bundle[contestType] + 'Contest');
    };

    const contestData = contestStore.contests[contestType] ? contestStore.contests[contestType] : {contestType};

    return (
        <div>
            <Header/>
            <div className={styles.startContestHeader}>
                <div className={styles.startContestInfo}>
                    <h2>
                        {title}
                    </h2>
                    <span>
                        Tell us a bit more about your business as well as your preferences so that creatives get a better idea about what you are looking for
                        </span>
                </div>
                <ProgressBar currentStep={2}/>
            </div>
            <div className={styles.container}>
                <div className={styles.formContainer}>
                    <ContestForm contestType={contestType} submitData={submitDataContest}
                                 defaultData={contestData}/>
                </div>
            </div>
            <div className={styles.footerButtonsContainer}>
                <div className={styles.lastContainer}>
                    <div className={styles.buttonsContainer}>
                        <BackButton/>
                        <NextButton/>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
};


const mapStateToProps = (state) => {
    const {contestStore, bundleStore} = state;
    return {contestStore, bundleStore};
};

const mapDispatchToProps = (dispatch) => ({
    saveContest: (data) => dispatch(saveContestToStore(data)),
    clearDataForContest: () => dispatch(clearDataForContest())
});

export default connect(mapStateToProps, mapDispatchToProps)(ContestCreationPage);

