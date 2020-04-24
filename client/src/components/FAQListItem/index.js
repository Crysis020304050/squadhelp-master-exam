import React from "react";
import PropTypes from 'prop-types';
import ReactHtmlParser from "react-html-parser";

const FAQListItem = ({className, index, question, answer}) => {

    return (
        <li key={index} className={className}>
            <h5>{question}</h5>
            <p>{ReactHtmlParser(answer)}</p>
        </li>
    );
};

FAQListItem.propTypes = {
    className: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
};

export default FAQListItem;