import React from 'react';
import styles from './InfinityScrollListContainer.module.sass';
import Spinner from '../../components/Spinner/Spinner';
import PropTypes from 'prop-types';
import InfiniteList from "react-infinite-scroll-list";


const InfinityScrollListReverseContainer = ({children, isFetching, loadMore, haveMore}) => {

    const isListOfChildrenEmpty = () => (
        !isFetching && children.length === 0
    );

    return (
        <>
            {isListOfChildrenEmpty() && <div className={styles.notFound}>Nothing not found</div>}
            {!isListOfChildrenEmpty() && <InfiniteList root='viewport' isLoading={isFetching} isEndReached={!haveMore} onReachThreshold={() => loadMore(children.length)}>
                {children}
                {isFetching && <Spinner/>}
            </InfiniteList>}
        </>
    );
};

InfinityScrollListContainer.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    loadMore: PropTypes.func.isRequired,
    haveMore: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};

export default InfinityScrollListContainer;