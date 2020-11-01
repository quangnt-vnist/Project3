import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, TreeSelect } from '../../../../common-components';
import { CareerPositionAction } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';
class CreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            archiveParent: ''
        }
    }

    handleName = (e) => {
        const { value } = e.target;
        const { translate } = this.props;
        const { message } = ValidationHelper.validateName(translate, value, 1, 255);
        this.setState({
            name: value,
            nameError: message
        });
    }

    handleCode = (e) => {
        const {value} = e.target;
        let msg;
        this.setState({
            code: value,
            codeError: msg,
        });
    }

    handleParent = (value) => {
        this.setState({ parent: value[0] });
    };

    isValidateForm = () => {
        let {name} = this.state;
        let {translate} = this.props;
        if(!ValidationHelper.validateName(translate, name, 1, 255).status) return false;
        return true;
    }

    save = () => {
        const data = {
            name: this.state.name,
            code: this.state.code,
            parent: this.state.parent,
        }
        console.log('data', data);
        // this.props.createDocumentArchive(data);
    }

    render() {
        const { translate, documents } = this.props;
        const { list } = this.props;
        let { parent, nameError, codeError } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-create-career-position"
                    formID="form-create-career-position"
                    title="Thêm vị trí công việc"
                    disableSubmit={!this.isValidateForm()}
                    func={this.save}
                >
                    <form id="form-create-career-position">
                        <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                            <label>Tên<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleName} />
                            <ErrorLabel content={nameError} />
                        </div>
                        <div className="form-group">
                            <label>Chọn thông tin cha</label>
                            <TreeSelect data={list} value={parent} handleChange={this.handleParent} mode="radioSelect" />
                        </div>
                        <div className={`form-group ${!codeError ? "" : "has-error"}`}>
                            <label>Nhãn<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleCode} />
                            <ErrorLabel content={nameError} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    createCareerPosition: CareerPositionAction.createCareerPosition,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm));