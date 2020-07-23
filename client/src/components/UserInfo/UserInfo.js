import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import UpdateUserInfoForm from '../../components/UpdateUserInfoForm/UpdateUserInfoForm';
import {updateUserData, changeEditModeOnUserProfile, clearUserError} from '../../actions/actionCreator';
import constants from '../../constants/constants';
import styles from './UserInfo.module.sass';
import money from 'money-math';
import Error from "../Error/Error";

const UserInfo = ({isEdit, changeEditMode, data, error, clearError, updateUser}) => {

    useEffect(() => {
        if (error) {
            clearError();
        }
    }, []);

    const updateUserData = ({file, firstName, lastName, displayName}) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('displayName', displayName);
        updateUser(formData);
    };

    const {avatar, firstName, lastName, displayName, email, role, balance} = data;
    const {ANONYM_IMAGE_PATH, publicURL, CREATOR} = constants;
    return (
        <div className={styles.mainContainer}>
            {error && <Error error={error} clearError={clearError}/>}
            {isEdit ? <UpdateUserInfoForm onSubmit={updateUserData}/>
                :
                <div className={styles.infoContainer}>
                    <img src={avatar === 'anon.png' ? ANONYM_IMAGE_PATH : `${publicURL}${avatar}`} className={styles.avatar} alt='user'/>
                    <div className={styles.infoContainer}>
                        <div className={styles.infoBlock}>
                            <span className={styles.label}>First Name</span>
                            <span className={styles.info}>{firstName}</span>
                        </div>
                        <div className={styles.infoBlock}>
                            <span className={styles.label}>Last Name</span>
                            <span className={styles.info}>{lastName}</span>
                        </div>
                        <div className={styles.infoBlock}>
                            <span className={styles.label}>Display Name</span>
                            <span className={styles.info}>{displayName}</span>
                        </div>
                        <div className={styles.infoBlock}>
                            <span className={styles.label}>Email</span>
                            <span className={styles.info}>{email}</span>
                        </div>
                        <div className={styles.infoBlock}>
                            <span className={styles.label}>Role</span>
                            <span className={styles.info}>{role}</span>
                        </div>
                        {role ===  CREATOR && <div className={styles.infoBlock}>
                            <span className={styles.label}>Balance</span>
                            <span className={styles.info}>{`${money.floatToAmount(balance)}$`}</span>
                        </div>}
                    </div>
                </div>
            }
            <div onClick={() => changeEditMode(!isEdit)}
                 className={styles.buttonEdit}>{isEdit ? 'Cancel' : 'Edit'}</div>
        </div>
    )
};

const mapStateToProps = (state) => {
    const {data, error} = state.userStore;
    const {isEdit} = state.userProfile;
    return {data, isEdit, error};
};

const mapDispatchToProps = (dispatch) => ({
    updateUser: (data) => dispatch(updateUserData(data)),
    changeEditMode: (data) => dispatch(changeEditModeOnUserProfile(data)),
    clearError: () => dispatch(clearUserError()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
