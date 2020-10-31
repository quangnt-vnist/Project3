import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RoleActions } from '../../role/redux/actions';
import { LinkActions } from '../redux/actions';
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';

class LinkInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    // Thiet lap cac gia tri tu props vao state
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.linkId !== prevState.linkId) {
            return {
                ...prevState,
                linkId: nextProps.linkId,
                linkUrl: nextProps.linkUrl,
                linkDescription: nextProps.linkDescription,
                linkRoles: nextProps.linkRoles,
                linkDescriptionError: undefined,
            }
        } else {
            return null;
        }
    }

    handleLinkDescription = (e) => {
        let {value} = e.target;
        let {translate} = this.props;
        let {message} = ValidationHelper.validateDescription(translate, value);
        this.setState({ 
            linkDescription: value,
            linkDescriptionError: message
        });
    }

    handleLinkRoles = (value) => {
        this.setState({
            linkRoles: value
        });
    }

    save = () => {
        const { linkId, linkUrl, linkDescription, linkRoles } = this.state;

        const link = {
            url: linkUrl,
            description: linkDescription,
            roles: linkRoles
        };

        if (this.isFormValidated()) {
            return this.props.editLink(linkId, link);
        }
    }

    isFormValidated = () => {
        let {linkDescription} = this.state;
        let {translate} = this.props;
        if(!ValidationHelper.validateDescription(translate, linkDescription).status) return false;
        return true;
    }

    componentDidMount() {
        this.props.getRole();
    }

    render() {
        const { translate, role, link } = this.props;
        const { linkId, linkUrl, linkDescription, linkRoles, linkDescriptionError } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    isLoading={link.isLoading}
                    func={this.save}
                    modalID="modal-edit-link"
                    formID="form-edit-link"
                    title={translate('manage_link.edit')}
                    disableSubmit={!this.isFormValidated()}
                >

                    {/* Form hỉnh sửa thông tin   */}
                    <form id="form-edit-link">

                        {/* Đường link của trang web */}
                        <div className="form-group">
                            <label>{translate('manage_link.url')}<span className="text-red"> * </span></label>
                            <input type="text" className="form-control" value={linkUrl} disabled />
                        </div>

                        {/* Mô tả về trang web */}
                        <div className={`form-group ${!linkDescriptionError ? "" : "has-error"}`}>
                            <label>{translate('manage_link.description')}<span className="text-red"> * </span></label>
                            <input type="text" className="form-control" value={linkDescription} onChange={this.handleLinkDescription} />
                            <ErrorLabel content={linkDescriptionError} />
                        </div>

                        {/* Những role được truy cập */}
                        <div className="form-group">
                            <label>{translate('manage_link.roles')}</label>
                            <SelectBox
                                id={`link-roles-${linkId}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={role.list.map(role => { return { value: role ? role._id : null, text: role ? role.name : "Role is deleted" } })}
                                onChange={this.handleLinkRoles}
                                value={linkRoles}
                                multiple={true}
                            />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { role, link } = state;
    return { role, link };
}

const getState = {
    getRole: RoleActions.get,
    editLink: LinkActions.edit,
}

export default connect(mapState, getState)(withTranslate(LinkInfoForm));