import React from 'react';
import PropTypes from 'prop-types';

const Article = props => {
    const {header, headerStyles, body, bodyStyles} = props;
    return (
        <>
            <div className={headerStyles}>{header}
            </div>
            <div className={bodyStyles}>
                {body}
            </div>
        </>
    );
};

Article.propTypes = {
    headerStyles: PropTypes.string,
    bodyStyles: PropTypes.string,
    header: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired
};

export default Article;