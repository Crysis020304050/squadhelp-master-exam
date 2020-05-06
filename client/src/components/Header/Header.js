import React, {useEffect, useState} from 'react';
import styles from './Header.module.sass';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import CONSTANTS from '../../constants';
import {clearUserStore, headerRequest} from '../../actions/actionCreator';
import HeaderUserInfo from "../HeaderUserInfo";
import HeaderLinks from "../HeaderLinks";
import {mdiMenu} from '@mdi/js';
import {mdiClose} from '@mdi/js';
import {Icon} from '@mdi/react';
import classNames from 'classnames';
import Logo from "../Logo";

const Header = ({getUser, data, clearUserStore, history, isFetching}) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleResize = () => {
        if (window.innerWidth > 800) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        if (!data) {
            getUser();
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const logOut = () => {
        localStorage.clear();
        clearUserStore();
        history.replace('/login');
    };

    const toggleMenu = () => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
        } else {
            setIsMenuOpen(true);
        }
    };

    const isRenderNotForModerator = () => {
        return data ? data.role !== CONSTANTS.MODERATOR : true
    };

    return (
        <>
            {!isFetching && (
                <div className={styles.headerContainer}>
                    <div
                        className={classNames(styles.loginSignnUpHeaders, {[styles.loginSingUpModeratorHeaders]: !isRenderNotForModerator()})}>
                        {
                            !isRenderNotForModerator() &&
                            <Logo className={styles.logoForModerator}/>
                        }
                        {
                            isRenderNotForModerator() && <>
                                <div className={styles.numberContainer}>
                                    <img src={`${CONSTANTS.STATIC_IMAGES_PATH}phone.png`} alt='phone'/>
                                    <span>(877)&nbsp;355-3585</span>
                                </div>
                                <Icon onClick={toggleMenu} className={styles.burgerMenu}
                                      path={isMenuOpen ? mdiClose : mdiMenu} size={1}/>
                            </>
                        }
                        <div className={styles.userButtonsContainer}>
                            <HeaderUserInfo logOut={logOut} className={styles.userInfo} data={data}/>
                        </div>
                    </div>
                    {isRenderNotForModerator() && (
                        <div className={classNames(styles.navContainer, {[styles.navContainerMobileOpen]: isMenuOpen})}>
                            <Logo className={styles.logo}/>
                            <div className={styles.leftNav}>
                                <div className={styles.nav}>
                                    <HeaderLinks className={styles.navLinks}/>
                                </div>
                                {data && data.role === CONSTANTS.CUSTOMER &&
                                <Link to='/startContest' className={styles.startContestBtn}>START CONTEST</Link>}
                            </div>
                        </div>)}
                </div>
            )}
        </>
    );
};

const mapStateToProps = state => state.userStore;

const mapDispatchToProps = dispatch => ({
    getUser: () => dispatch(headerRequest()),
    clearUserStore: () => dispatch(clearUserStore()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));