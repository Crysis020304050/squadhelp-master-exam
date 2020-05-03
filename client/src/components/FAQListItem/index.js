import React from "react";
import PropTypes from 'prop-types';
import ReactHtmlParser from "react-html-parser";

const FAQListItem = ({className, question, answer}) => {

    return (
        <li className={className}>
            <h5>{question}</h5>
            <div>{ReactHtmlParser(answer)}</div>
        </li>
    );
};

FAQListItem.propTypes = {
    className: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
};

export default FAQListItem;