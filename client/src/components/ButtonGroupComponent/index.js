import React, {useState} from "react";
import styles from './ButtonGroupComponent.module.sass';
import buttonsData from './butonsData';
import classNames from 'classnames';

const Button = ({type, description, index, activeButtonIndex, setActiveButtonIndex}) => {

    const onClickHandler = e => {
        setActiveButtonIndex(index);
    };

    return (
        <li className={classNames(styles.buttonContainer, {[styles.activeButton]: index === activeButtonIndex})} onClick={onClickHandler}>
            <div>{type}</div>
            <h5>{description}</h5>
        </li>
    );

};

const ButtonGroupComponent = props => {
    const [activeButtonIndex, setActiveButtonIndex] = useState(1);

    return (
        <>
            <div className={styles.textContainer}>
                <h5>Do you want a matching domain (.com URL) with your name?</h5>
                <p>If you want a matching domain, our platform will only accept those name suggestions where the domain is available. (Recommended)</p>
            </div>
            <ul className={styles.buttonGroupContainer}>
                {
                    [...buttonsData].map((item, index) => <Button key={index} {...item} index={index}
                                                                  activeButtonIndex={activeButtonIndex}
                                                                  setActiveButtonIndex={setActiveButtonIndex}/>)
                }
            </ul>
        </>
    );
};

export default ButtonGroupComponent;