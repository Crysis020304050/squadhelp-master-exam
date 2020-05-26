import React, {Component} from 'react';
import styles from './Footer.module.sass';
import constants from '../../constants';
import {Link} from "react-router-dom";


class Footer extends Component {

    topFooterItemsRender = (item) => {
        return (
            <div key={item.title}>
                <h4>{item.title}</h4>
                {item.items.map(i => <Link key={i} to="/">{i}</Link>)}
            </div>
        );
    };

    topFooterRender() {
        return constants.FooterItems.map(item => this.topFooterItemsRender(item))
    };

    render() {
        return (
            <div className={styles.footerContainer}>
                <div className={styles.footerTop}>
                    <div>
                        {this.topFooterRender()}
                    </div>
                </div>
            </div>
        )
    }
}

export default Footer;
