import React from 'react';
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

class ContestForm extends React.Component {
    constructor(props) {
        super(props);
        submitFunc = props.submitData;
    }

    getPreference = () => {
        const {contestType} = this.props;
        switch (contestType) {
            case constants.NAME_CONTEST: {
                this.props.getData(
                    {characteristic1: 'nameStyle', characteristic2: 'typeOfName'});
                break;
            }
            case constants.TAGLINE_CONTEST: {
                this.props.getData({characteristic1: 'typeOfTagline'});
                break;
            }
            case constants.LOGO_CONTEST: {
                this.props.getData({characteristic1: 'brandStyle'});
                break;
            }
            default: {
                return null;
            }
        }
    };

    componentDidMount() {
        this.getPreference(this.props.contestType);
        this.props.initialize(this.props.defaultData);
    }

    renderSpecialInputs = () => {

        const formInputClasses = {
            containerStyle: styles.inputContainer,
            className: styles.input,
            warningStyle: styles.warning,
        };

        switch (this.props.contestType) {
            case constants.NAME_CONTEST: {
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
                            optionsArray={this.props.dataForContest.data.nameStyle}
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
                            optionsArray={this.props.dataForContest.data.typeOfName}
                        />
                    </>
                );
            }
            case constants.LOGO_CONTEST: {
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
                            optionsArray={this.props.dataForContest.data.brandStyle}
                        />
                    </>
                );
            }
            case constants.TAGLINE_CONTEST: {
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
                            optionsArray={this.props.dataForContest.data.typeOfTagline}
                        />
                    </>
                );
            }
        }
    };

    render() {
        const {isFetching, error} = this.props.dataForContest;
        const {handleSubmit, contestType} = this.props;

        const formInputClasses = {
            containerStyle: styles.inputContainer,
            className: styles.input,
            warningStyle: styles.warning,
        };

        if (error) {
            return <TryAgain getData={this.getPreference}/>;
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
                                            optionsArray={this.props.dataForContest.data.industry}
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
                                    {this.renderSpecialInputs()}
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
                                    {contestType === constants.NAME_CONTEST && <ButtonGroupComponent/>}
                                </form>
                            </div>
                    }
                </>
            );
        }
    }
}

const submit = (values) => {
    submitFunc(values);
};

const mapStateToProps = (state, ownProps) => {
    return {
        contestStore: state.contestStore,
        dataForContest: state.dataForContest,
        initialValues: ownProps.defaultData,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        getData: (data) => dispatch(getDataForContest(data)),
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(reduxForm({
        form: 'contestForm',
        validate: customValidator(Schems.ContestSchem),
        onSubmit: submit
    })(ContestForm)));