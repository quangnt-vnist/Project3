import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CrmGroupActions } from '../redux/actions';
import { DialogModal, ButtonModal, SelectBox, ErrorLabel } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';

class EditGroupForm extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.state = {
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
            editingGroup: {}
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.groupIdEdit !== state.groupIdEdit) {
            props.getGroup(props.groupIdEdit);
            return {
                dataStatus: 1,
                groupIdEdit: props.groupIdEdit,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        let { editingGroup } = this.state;
        if (this.state.dataStatus === this.DATA_STATUS.QUERYING && !nextProps.crm.groups.isLoading) {
            let group = nextProps.crm.groups.groupById;
            editingGroup = {
                ...editingGroup,
                code: group && group.code,
                name: group && group.name,
                description: group && group.description,
                promotion: group && group.promotion,
            }
            this.setState({
                dataStatus: this.DATA_STATUS.AVAILABLE,
                editingGroup,
            })
            return false;
        }

        if (this.state.dataStatus === this.DATA_STATUS.AVAILABLE) {
            this.setState({
                dataStatus: this.DATA_STATUS.FINISHED,
            });
            return false;
        }
        return true;
    }

    handleChangeGroupCode = (e) => {
        let { editingGroup } = this.state;
        const { value } = e.target;
        const { translate } = this.props;
        this.setState({
            editingGroup: {
                ...editingGroup,
                code: value
            }
        });
        // validate Mã nhóm khách hàng
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ groupCodeEditFormError: message });
    }

    handleChangeGroupName = (e) => {
        let { editingGroup } = this.state;
        const { value } = e.target;
        const { translate } = this.props;

        this.setState({
            editingGroup: {
                ...editingGroup,
                name: value
            }
        });
        // validate tên nhóm khách hàng
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ groupNameEditFormError: message });
    }

    handleChangeGroupDescription = (e) => {
        let { editingGroup } = this.state;
        const { value } = e.target;

        this.setState({
            editingGroup: {
                ...editingGroup,
                description: value
            }
        });
    }

    handleChangeGroupPromotion = (e) => {
        let { editingGroup } = this.state;
        const { value } = e.target;

        this.setState({
            editingGroup: {
                ...editingGroup,
                promotion: value
            }
        });
    }

    isFormValidated = () => {
        const { editingGroup } = this.state;
        const { code, name } = editingGroup;
        const { translate } = this.props;

        if (!ValidationHelper.validateName(translate, code).status
            || !ValidationHelper.validateDescription(translate, name).status)
            return false;
        return true;
    }

    save = () => {
        const { editingGroup, groupIdEdit } = this.state;
        if (this.isFormValidated) {
            this.props.editGroup(groupIdEdit, editingGroup);
        }
    }

    render() {
        const { translate, crm } = this.props;
        const { groups } = crm;
        const { editingGroup, groupCodeEditFormError, groupNameEditFormError } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-edit-group" isLoading={groups.isLoading}
                    formID="form-edit-group"
                    title="Chỉnh sửa nhóm khách hàng"
                    func={this.save} size={50}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form thêm nhóm khách hàng mới */}
                    <form id="form-crm-group-edit">
                        {/* Mã nhóm khách hàng */}
                        <div className={`form-group ${!groupCodeEditFormError ? "" : "has-error"}`}>
                            <label>{translate('crm.group.code')}<span className="attention"> * </span></label>
                            <input type="text" className="form-control" value={editingGroup.code ? editingGroup.code : ''} onChange={this.handleChangeGroupCode} />
                            <ErrorLabel content={groupCodeEditFormError} />
                        </div>

                        {/* Tên nhóm khách hàng */}
                        <div className={`form-group ${!groupNameEditFormError ? "" : "has-error"}`}>
                            <label>{translate('crm.group.name')}<span className="attention"> * </span></label>
                            <input type="text" className="form-control" value={editingGroup.name ? editingGroup.name : ''} onChange={this.handleChangeGroupName} />
                            <ErrorLabel content={groupNameEditFormError} />
                        </div>

                        {/* Mô tả nhóm khách hàng */}
                        <div className="form-group">
                            <label>{translate('crm.group.description')}</label>
                            <textarea type="text" value={editingGroup.description ? editingGroup.description : ''} className="form-control" onChange={this.handleChangeGroupDescription} />
                        </div>

                        {/* Ưu đãi kèm theo nhóm khách hàng */}
                        <div className="form-group">
                            <label>{translate('crm.group.promotion')}</label>
                            <input type="text" className="form-control" value="" value={editingGroup.promotion ? editingGroup.promotion : ''} onChange={this.handleChangeGroupPromotion} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
    getGroup: CrmGroupActions.getGroup,
    editGroup: CrmGroupActions.editGroup,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditGroupForm));