import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import constants from '../../../../constants/constants';
import {
    changeTypeOfChatAdding,
    changeShowAddChatToCatalogMenu,
    getCatalogList
} from '../../../../actions/actionCreator';
import styles from './CatalogCreation.module.sass';
import AddToCatalog from '../AddToCatalog/AddToCatalog';
import classNames from 'classnames';
import CreateCatalog from '../CreateCatalog/CreateCatalog';

const CatalogCreation = ({getCatalogList, changeTypeOfChatAdding, catalogCreationMode, changeShowAddChatToCatalogMenu, isFetching, isCatalogsLoaded}) => {

    const {ADD_CHAT_TO_OLD_CATALOG, CREATE_NEW_CATALOG_AND_ADD_CHAT} = constants;

    useEffect(() => {
        if (!isCatalogsLoaded) {
            getCatalogList();
        }
    }, []);

    return (
        <>
            {
                !isFetching && <div className={styles.catalogCreationContainer}>
                    <i className="far fa-times-circle" onClick={() => changeShowAddChatToCatalogMenu()}/>
                    <div className={styles.buttonsContainer}>
                            <span onClick={() => changeTypeOfChatAdding(ADD_CHAT_TO_OLD_CATALOG)}
                                  className={classNames({[styles.active]: catalogCreationMode === ADD_CHAT_TO_OLD_CATALOG})}>Old</span>
                        <span onClick={() => changeTypeOfChatAdding(CREATE_NEW_CATALOG_AND_ADD_CHAT)}
                              className={classNames({[styles.active]: catalogCreationMode === CREATE_NEW_CATALOG_AND_ADD_CHAT})}>New</span>
                    </div>
                    {catalogCreationMode === CREATE_NEW_CATALOG_AND_ADD_CHAT ? <CreateCatalog/> : <AddToCatalog/>}
                </div>
            }
        </>
    )
};

const mapStateToProps = (state) => state.chatStore;

const mapDispatchToProps = (dispatch) => ({
    changeTypeOfChatAdding: (data) => dispatch(changeTypeOfChatAdding(data)),
    changeShowAddChatToCatalogMenu: () => dispatch(changeShowAddChatToCatalogMenu()),
    getCatalogList: () => dispatch(getCatalogList())
});

export default connect(mapStateToProps, mapDispatchToProps)(CatalogCreation);