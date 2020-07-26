import React, {useRef} from 'react';
import styles from './BundleBox.module.sass';
import constants from '../../constants/constants';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const BundleBox = ({path, header, setBundle, describe}) => {

    const containerRef = useRef();

    const defaultPathToImages = `${constants.STATIC_IMAGES_PATH}contestLabels/`;

    const renderImage = () => {
        const array = [];
        for (let i = 0; i < path.length; i++)
            array.push(<img src={defaultPathToImages + path[i]} key={i}
                            className={styles.imgContainer} alt={path[i].replace(/.png/g,"Contest") }/>);
        return array;
    };

    const mouseOverHandler = () => {
        const element = containerRef.current;
        for (let i = 0; i < element.children[0].children.length; i++) {
            element.children[0].children[i].src = defaultPathToImages + 'blue_' + path[i];
        }
    };

    const mouseOutHandler = () => {
        const element = containerRef.current;
        for (let i = 0; i < element.children[0].children.length; i++) {
            element.children[0].children[i].src = defaultPathToImages + path[i];
        }
    };

    return (
        <div onMouseOver={mouseOverHandler} onMouseOut={mouseOutHandler} onClick={() => setBundle(header)}
             ref={containerRef} className={classNames(styles.bundleContainer, {[styles.combinedBundle]: path.length > 1})}>
            <div>
                {renderImage()}
            </div>
            <div className={styles.infoContainer}>
                <span className={styles.bundleName}>{header}</span>
                <hr/>
                <span className={styles.infoBundle}>{describe}</span>
            </div>
        </div>
    )
};

BundleBox.propTypes = {
    path: PropTypes.array.isRequired,
    header: PropTypes.string.isRequired,
    describe: PropTypes.string.isRequired,
    setBundle: PropTypes.func.isRequired,
};

export default BundleBox;