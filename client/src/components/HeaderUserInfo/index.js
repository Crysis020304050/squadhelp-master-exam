import React from "react";
import constants from '../../constants/constants';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

const HeaderUserInfo = ({className, logOut, data}) => {

    return (
        <>
            {
                data
                    ? (<div className={className}>
                        <img
                            src={data.avatar === 'anon.png' ? constants.ANONYM_IMAGE_PATH : `${constants.publicURL}${data.avatar}`}
                            alt='user'/>
                        <span>{`Hi, ${data.displayName}`}</span>
                        <img src={`${constants.STATIC_IMAGES_PATH}menu-down.png`} alt='menu'/>
                        <ul>
                            <li><Link to='/dashboard'>View Dashboard</Link></li>
                            <li><Link to='/account'>My Account</Link></li>
                            {data.role !== constants.MODERATOR && <>
                                {data.role === constants.CREATOR && <li><Link to='/transactions'>My Transactions</Link></li>}
                                <li><Link to='/events'>My Events</Link></li>
                                <li><Link to='/'>Messages</Link></li>
                                <li><Link to='/'>Affiliate Dashboard</Link></li>
                            </>
                            }
                            <li onClick={logOut}>Logout</li>
                        </ul>
                    </div>)
                    : <>
                        <Link to='/login'>LOGIN</Link>
                        <Link to='/registration'>SIGN UP</Link>
                    </>
            }
        </>
    );
};

HeaderUserInfo.propTypes = {
    className: PropTypes.string.isRequired,
    logOut: PropTypes.func,
    data: PropTypes.object,
};

export default HeaderUserInfo;