import React from 'react';
import CONTANTS from '../../constants/constants';
import {connect} from 'react-redux';
import {setOffer, clearAddOfferError} from '../../actions/actionCreator';
import styles from './OfferForm.module.sass';
import {reduxForm, Field} from 'redux-form';
import ImageUpload from '../InputComponents/ImageUpload/ImageUpload';
import customValidator from "../../validators/validator";
import Schems from "../../validators/validationSchems";
import Error from '../../components/Error/Error';
import FormField from "../FormField";


let contestType;

const OfferForm = (props) => {

    const formInputClasses = {
        containerStyle: styles.inputContainer,
        className: styles.input,
        warningStyle: styles.fieldWarning,
        invalidStyle: styles.notValid,
    };

    const renderOfferInput = () => {
        if (props.contestType === CONTANTS.LOGO_CONTEST) {
            return (
                <Field
                    name='offerData'
                    component={ImageUpload}
                    classes={{
                        uploadContainer: styles.imageUploadContainer,
                        inputContainer: styles.uploadInputContainer,
                        imgStyle: styles.imgStyle
                    }}
                />
            )
        } else {
            return (
                <Field
                    name='offerData'
                    {...formInputClasses}
                    component={FormField}
                    type='text'
                    label='your suggestion'
                />
            )
        }
    };


    const setOffer = (values) => {
        props.clearOfferError();
        const data = new FormData();
        const {contestId, contestType, customerId, reset} = props;
        data.append('contestId', contestId);
        data.append('contestType', contestType);
        data.append('offerData', values.offerData);
        data.append('customerId', customerId);
        props.setNewOffer(data);
        reset();
    };

    contestType = props.contestType;
    const {handleSubmit, valid, addOfferError, clearOfferError} = props;
    return (
        <div className={styles.offerContainer}>
            {addOfferError &&
            <Error error={addOfferError} clearError={clearOfferError}/>}
            <form onSubmit={handleSubmit(setOffer)} className={styles.form}>
                {renderOfferInput()}
                {valid && <button type='submit' className={styles.btnOffer}>Send Offer</button>}
            </form>
        </div>
    )
};


const mapDispatchToProps = (dispatch) => {
    return {
        setNewOffer: (data) => dispatch(setOffer(data)),
        clearOfferError: () => dispatch(clearAddOfferError())
    }
};

const mapStateToProps = (state) => {
    const {addOfferError} = state.contestByIdStore;
    return {addOfferError};
};


export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'offerForm',
    validate: customValidator(contestType === CONTANTS.LOGO_CONTEST ? Schems.LogoOfferSchema : Schems.TextOfferSchema)
})(OfferForm));