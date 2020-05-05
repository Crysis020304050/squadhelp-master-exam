import React from "react";
import linksData from './linksData.json';
import PropTypes from 'prop-types';
import CONSTANTS from "../../constants";
import {Link} from "react-router-dom";


const HeaderLinks = ({className}) => {

    const renderLink = ({categoryName, links}, index) => {
        return (
            <li key={index}>
                <span>{categoryName}</span><img src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`} alt='menu'/>
                <ul>
                    {
                        links.map(({name, link}, index) => (
                            <li key={index}>
                                <Link to={link}>{name}</Link>
                            </li>
                        ))
                    }
                </ul>
            </li>
        )
    };

    return (
        <ul className={className}>
            {
                [...linksData].map((item, index) => renderLink(item, index))
            }
        </ul>
    );
};

HeaderLinks.propTypes = {
    className: PropTypes.string.isRequired,
};

export default HeaderLinks;