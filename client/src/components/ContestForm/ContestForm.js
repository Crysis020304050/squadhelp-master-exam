import React, {useEffect} from 'react';
import constants from '../../constants/constants';
import {connect} from 'react-redux';
import {getDataForContest} from '../../actions/actionCreator';
import {withRouter} from 'react-router-dom';
import styles from './ContestForm.module.sass';
import Spinner from '../Spinner/Spinner';
import {Field, reduxForm} from 'redux-form';
import SelectInput from '../SelectInput/SelectInput';
import customValidator from '../../validators/validator';
import Schems from '../../validators/validationSchems';
import FieldFileInput from '../InputComponents/FieldFileInput/FieldFileInput';
import FormTextArea from '../InputComponents/FormTextArea/FormTextArea';
import TryAgain from '../TryAgain/TryAgain';
import FormField from "../FormField";
import ButtonGroupComponent from "../ButtonGroupComponent";

let submitFunc;

const ContestForm = ({submitData, contestType, getData, initialize, defaultData, dataForContest, handleSubmit}) => {

    const {NAME_CONTEST, TAGLINE_CONTEST, LOGO_CONTEST} = constants;

    const {data, isFetching, error} = dataForContest;

    const getPreference = () => {
        switch (contestType) {
            case NAME_CONTEST: {
                getData({characteristic1: 'nameStyle', characteristic2: 'typeOfName'});
                break;
            }
            case TAGLINE_CONTEST: {
                getData({characteristic1: 'typeOfTagline'});
                break;
            }
            case LOGO_CONTEST: {
                getData({characteristic1: 'brandStyle'});
                break;
            }
            default: {
                return null;
            }
        }
    };

    useEffect(() => {
        submitFunc = submitData;
        getPreference(contestType);
        initialize(defaultData);
    }, []);

    const renderSpecialInputs = () => {

        const formInputClasses = {
            containerStyle: styles.inputContainer,
            className: styles.input,
            warningStyle: styles.warning,
        };

        switch (contestType) {
            case NAME_CONTEST: {
                return (
                    <>
                        <Field
                            name='styleName'
                            component={SelectInput}
                            header='Style name'
                            classes={{
                                inputContainer: styles.selectInputContainer,
                                inputHeader: styles.selectHeader,
                                selectInput: styles.select,
                            }}
                            optionsArray={data.nameStyle}
                        />
                        <Field
                            name='typeOfName'
                            component={SelectInput}
                            classes={{
                                inputContainer: styles.selectInputContainer,
                                inputHeader: styles.selectHeader,
                                selectInput: styles.select,
                            }}
                            header='type of company'
                            optionsArray={data.typeOfName}
                        />
                    </>
                );
            }
            case LOGO_CONTEST: {
                return (
                    <>
                        <div className={styles.inputContainer}>
              <span
                  className={styles.inputHeader}>What name of your venture?</span>
                            <Field
                                name='nameVenture'
                                {...formInputClasses}
                                component={FormField}
                                type='text'
                                label='name of venture'
                            />
                        </div>
                        <Field
                            name='brandStyle'
                            component={SelectInput}
                            classes={{
                                inputContainer: styles.selectInputContainer,
                                inputHeader: styles.selectHeader,
                                selectInput: styles.select,
                            }}
                            header='Brand Style'
                            optionsArray={data.brandStyle}
                        />
                    </>
                );
            }
            case TAGLINE_CONTEST: {
                return (
                    <>
                        <div className={styles.inputContainer}>
              <span
                  className={styles.inputHeader}>What name of your venture?</span>
                            <Field
                                name='nameVenture'
                                {...formInputClasses}
                                component={FormField}
                                type='text'
                                label='name of venture'
                            />
                        </div>
                        <Field
                            name='typeOfTagline'
                            component={SelectInput}
                            classes={{
                                inputContainer: styles.selectInputContainer,
                                inputHeader: styles.selectHeader,
                                selectInput: styles.select,
                            }}
                            header='Type tagline'
                            optionsArray={data.typeOfTagline}
                        />
                    </>
                );
            }
        }
    };

    const formInputClasses = {
        containerStyle: styles.inputContainer,
        className: styles.input,
        warningStyle: styles.warning,
    };

    if (error) {
        return <TryAgain getData={getPreference}/>;
    } else {
        return (
            <>
                {
                    isFetching ? <Spinner/>
                        :
                        <div className={styles.formContainer}>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.inputContainer}>
                    <span
                        className={styles.inputHeader}>Title of contest</span>
                                    <Field
                                        name='title'
                                        {...formInputClasses}
                                        component={FormField}
                                        type='text'
                                        label='Title'
                                    />
                                </div>
                                <div className={styles.inputContainer}>
                                    <Field
                                        name='industry'
                                        component={SelectInput}
                                        classes={{
                                            inputContainer: styles.selectInputContainer,
                                            inputHeader: styles.selectHeader,
                                            selectInput: styles.select,
                                        }}
                                        header='Describe industry associated with your venture'
                                        optionsArray={data.industry}
                                    />
                                </div>
                                <div className={styles.inputContainer}>
                                        <span
                                            className={styles.inputHeader}>What does your company / business do?</span>
                                    <Field
                                        name='focusOfWork'
                                        component={FormTextArea}
                                        type='text'
                                        label='e.g. We`re an online lifestyle brand that provides stylish and high quality apparel to the expert eco-conscious shopper'
                                        classes={{
                                            container: styles.componentInputContainer,
                                            inputStyle: styles.textArea,
                                            warning: styles.warning,
                                        }}
                                    />
                                </div>
                                <div className={styles.inputContainer}>
                                    <span className={styles.inputHeader}>Tell us about your customers</span>
                                    <Field
                                        name='targetCustomer'
                                        component={FormTextArea}
                                        type='text'
                                        label='customers'
                                        classes={{
                                            container: styles.componentInputContainer,
                                            inputStyle: styles.textArea,
                                            warning: styles.warning,
                                        }}
                                    />
                                </div>
                                {renderSpecialInputs()}
                                <Field
                                    name='file'
                                    component={FieldFileInput}
                                    classes={{
                                        fileUploadContainer: styles.fileUploadContainer,
                                        labelClass: styles.label,
                                        fileNameClass: styles.fileName,
                                        fileInput: styles.fileInput,
                                    }}
                                    type='file'
                                />
                                {contestType === NAME_CONTEST && <ButtonGroupComponent/>}
                            </form>
                        </div>
                }
            </>
        );
    }
};

const submit = (values) => {
    submitFunc(values);
};

const mapStateToProps = (state, ownProps) => ({
    contestStore: state.contestStore,
    dataForContest: state.dataForContest,
    initialValues: ownProps.defaultData,
});

const mapDispatchToProps = (dispatch) => ({
    getData: (data) => dispatch(getDataForContest(data)),
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(reduxForm({
        form: 'contestForm',
        validate: customValidator(Schems.ContestSchem),
        onSubmit: submit
    })(ContestForm)));