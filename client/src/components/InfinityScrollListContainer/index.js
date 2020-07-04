import React from 'react';
import styles from './InfinityScrollListContainer.module.sass';
import Spinner from '../../components/Spinner/Spinner';
import PropTypes from 'prop-types';
import InfiniteList from "react-infinite-scroll-list";
import InfiniteScrollReverse from "react-infinite-scroll-reverse";


const InfinityScrollListContainer = ({children, isFetching, loadMore, haveMore, isReverse, className, refLink}) => (
    <>
        {!isFetching && !children.length && !isReverse && <div className={styles.notFound}>Nothing not found</div>}
        {isReverse
            ? <InfiniteScrollReverse ref={refLink} className={className} isLoading={isFetching} hasMore={haveMore}
                                     loadMore={() => loadMore(children.length)}>
                {isFetching && <Spinner/>}
                {children}
            </InfiniteScrollReverse>
            : <InfiniteList containerClassName={className} root='viewport' isLoading={isFetching} isEndReached={!haveMore}
                            onReachThreshold={() => loadMore(children.length)}>
                {children}
                {isFetching && <Spinner/>}
            </InfiniteList>}
    </>
);

InfinityScrollListContainer.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    loadMore: PropTypes.func.isRequired,
    haveMore: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    isReverse: PropTypes.bool,
    className: PropTypes.string,
};

export default InfinityScrollListContainer;


