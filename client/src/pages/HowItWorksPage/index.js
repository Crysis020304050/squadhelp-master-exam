import React from "react";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './HowItWorksPage.module.sass';
import ReactPlayer from 'react-player'
import stepsData from './stepsData';
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import questionsData from './questionsData';
import StepCard from "../../components/StepCard";
import FAQListItem from "../../components/FAQListItem";
import GetInTouchPanel from "../../components/GetInTouchPanel";

const HowItWorksPage = ({data}) => {

    return (
        <div className={styles.page}>
            <Header/>
            <div className={styles.contentContainer}>
                <section className={styles.videoPlayerSection}>
                    <ReactPlayer url='https://www.youtube.com/watch?v=33Fk6QocUEk'/>
                    <div className={styles.textContainer}>
                        <h2>How does squadhelp works?</h2>
                        <p>Squadhelp allows you to host branding competitions to engage with the most creative people
                            across the globe and get high-quality results, fast. Thousands of creatives compete with
                            each other, suggesting great name ideas. At the end of the collaborative contest, you select
                            one winner. The winner gets paid, and you get a strong brand name that will help you
                            succeed! It's quick, simple, and costs a fraction of an agency. </p>
                    </div>
                </section>
                <section className={styles.stepsSection}>
                    <h2>5 Simple Steps</h2>
                    <ul className={styles.stepsContainer}>
                        {
                            [...stepsData].map((item, index) => <StepCard className={styles.step} index={index} {...item}/>)
                        }
                    </ul>
                </section>
                <section className={styles.startContestButtonWrapper}>
                    <Link to={data ? 'startContest' : 'login'} className={styles.startContestButton}>Start A Contest</Link>
                </section>
                <section className={styles.frequencyAskedQuestionsContainer}>
                    <div className={styles.frequencyAskedQuestionsHeader}>
                        <div className={styles.questionMark}>?</div>
                        <h3>Frequently Asked Questions</h3>
                    </div>
                    <ul>
                        {
                            [...questionsData].map((item, index) => <FAQListItem className={styles.questionsListItem} index={index} {...item}/>)
                        }
                    </ul>
                </section>
            </div>
            <GetInTouchPanel/>
            <Footer/>
        </div>
    );
};

const mapStateToProps = state => state.userStore;

export default connect(mapStateToProps)(HowItWorksPage);