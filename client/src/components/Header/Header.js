import React, {useEffect, useState, useRef} from 'react';
import styles from './Header.module.sass';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import constants from '../../constants/constants';
import {logoutRequest} from '../../actions/actionCreator';
import HeaderUserInfo from "../HeaderUserInfo";
import HeaderLinks from "../HeaderLinks";
import {mdiMenu, mdiClose} from '@mdi/js';
import {Icon} from '@mdi/react';
import classNames from 'classnames';
import Logo from "../Logo";

const Header = ({data, logout}) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleContainer = useRef();

    const handleResize = () => {
        if (isMenuOpen && window.innerWidth > 800) {
            setIsMenuOpen(false);
        }
    };

    const onClickOutsideHandler = e => {
        if (isMenuOpen && !toggleContainer.current.contains(e.target)) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousedown', onClickOutsideHandler);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousedown', onClickOutsideHandler);
        };
    }, [isMenuOpen]);

    const onLogout = () => {
        const refreshToken = localStorage.getItem(constants.REFRESH_TOKEN);
        logout({refreshToken, id: data.id});
    };

    const toggleMenu = () => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
        } else {
            setIsMenuOpen(true);
        }
    };

    const isRenderNotForModerator = () => {
        return data ? data.role !== constants.MODERATOR : true
    };

    return (
        <>
            <div ref={toggleContainer} className={styles.headerContainer}>
                <div
                    className={classNames(styles.loginSignnUpHeaders, {[styles.loginSingUpModeratorHeaders]: !isRenderNotForModerator()})}>
                    {
                        !isRenderNotForModerator() &&
                        <Logo className={styles.logoForModerator}/>
                    }
                    {
                        isRenderNotForModerator() && <>
                            <div className={styles.numberContainer}>
                                <img src={`${constants.STATIC_IMAGES_PATH}phone.png`} alt='phone'/>
                                <span>(877)&nbsp;355-3585</span>
                            </div>
                            <Icon onClick={toggleMenu} className={styles.burgerMenu}
                                  path={isMenuOpen ? mdiClose : mdiMenu} size={1}/>
                        </>
                    }
                    <div className={styles.userButtonsContainer}>
                        <HeaderUserInfo logOut={onLogout} className={styles.userInfo} data={data}/>
                    </div>
                </div>
                {isRenderNotForModerator() && (
                    <div className={classNames(styles.navContainer, {[styles.navContainerMobileOpen]: isMenuOpen})}>
                        <Logo className={styles.logo}/>
                        <div className={styles.leftNav}>
                            <div className={styles.nav}>
                                <HeaderLinks className={styles.navLinks}/>
                            </div>
                            {data && data.role === constants.CUSTOMER &&
                            <Link to='/startContest' className={styles.startContestBtn}>START CONTEST</Link>}
                        </div>
                    </div>)}
            </div>
        </>
    );
};

const mapStateToProps = state => state.userStore;

const mapDispatchToProps = dispatch => ({
    logout: (data) => dispatch(logoutRequest(data)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));