import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { exampleActions } from '../redux/actions';

class ExampleCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exampleName: "",
            description: ""
        }
    }

    isFormValidated = () => {
        const { exampleName } = this.state;
        let { translate } = this.props;
        if (!ValidationHelper.validateName(translate, exampleName, 6, 255).status) {
            return false;
        }
        return true;
    }

    save = () => {
        if (this.isFormValidated()) {
            const { exampleName, description } = this.state;
            this.props.createExample({ exampleName, description });
        }
    }

    handleExampleName = (e) => {
        const { value } = e.target;
        this.setState({
            exampleName: value
        });
        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 6, 255);
        this.setState({ exampleNameError: message })
    }

    handleExampleDescription = (e) => {
        const { value } = e.target;
        this.setState({
            description: value
        });
    }

    render() {
        const { translate, example } = this.props;
        const { exampleName, description, exampleNameError } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-example" button_name={translate('manage_example.add')} title={translate('manage_example.add_title')} />
                <DialogModal
                    modalID="modal-create-example" isLoading={example.isLoading}
                    formID="form-create-example"
                    title={translate('manage_example.add_title')}
                    msg_success={translate('manage_example.add_success')}
                    msg_faile={translate('manage_example.add_fail')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-create-example" onSubmit={() => this.save(translate('manage_example.add_success'))}>
                        <div className={`form-group ${!exampleNameError ? "" : "has-error"}`}>
                            <label>{translate('manage_example.exampleName')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={exampleName} onChange={this.handleExampleName}></input>
                            <ErrorLabel content={exampleNameError} />
                        </div>
                        <div className={`form-group`}>
                            <label>{translate('manage_example.example_description')}</label>
                            <input type="text" className="form-control" value={description} onChange={this.handleExampleDescription}></input>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const example = state.example1;
    return { example }
}

const mapDispatchToProps = {
    createExample: exampleActions.createExample
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ExampleCreateForm)); 