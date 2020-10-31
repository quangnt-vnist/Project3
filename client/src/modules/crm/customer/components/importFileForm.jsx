import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SelectBox, ErrorLabel } from '../../../../common-components';

class CrmCustomerImportFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roleName: '',
            roleParents: [],
            roleUsers: []
        }
    }

    render() {
        const { translate, crm } = this.props;
        const { customer } = this.props;
        const { nameError } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-customer-import" isLoading={crm.customers.isLoading}
                    formID="form-customer-import"
                    title="Nhập dữ liệu khách hàng"
                    func={this.save}
                >
                    {/* Form thêm khách hàng mới */}
                    <form id="form-customer-import">
                        <div style={{
                            padding: '20px',
                            backgroundColor: '#FFE6CC',
                            marginBottom: '10px'
                        }}>
                            <label className="text-red">Chú ý !</label>
                            <ul>
                                <li>Mã khách hàng phải là duy nhất</li>
                                <li>File import phải có định dạng .xlsx</li>
                                <li>Dung lượng file không quá 5Mb</li>
                            </ul>
                        </div>
                        <div className="form-group">
                            <input type="file" className="form-control" /><br />
                        </div>
                    </form>
                </DialogModal>

            </React.Fragment>
        );
    }

    componentDidMount() {

    }

    // Xy ly va validate role name
    handleRoleName = (e) => {
        const { value } = e.target;
        this.validateRoleName(value, true);
    }

    handleParents = (value) => {
        this.setState(state => {
            return {
                ...state,
                roleParents: value
            }
        });
    }

    handleUsers = (value) => {
        this.setState(state => {
            return {
                ...state,
                roleUsers: value
            }
        });
    }

    handleRoleUser = (e) => {
        const { value } = e.target;
        this.setState(state => {
            return {
                ...state,
                roleUsers: [value]
            }
        });
    }

    isFormValidated = () => {
        let result = this.validateRoleName(this.state.roleName, false);
        return result;
    }

    save = () => {
        const data = {
            name: this.state.roleName,
            parents: this.state.roleParents,
            users: this.state.roleUsers
        }

        if (this.isFormValidated()) {
            return this.props.create(data);
        }
    }
}

function mapStateToProps(state) {
    const { customer, customerGroup, crm } = state;
    return { customer, customerGroup, crm };
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomerImportFile));