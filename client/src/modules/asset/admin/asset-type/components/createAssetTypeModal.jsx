import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, TreeSelect, ErrorLabel } from '../../../../../common-components';

import { AssetCreateValidator } from '../../../base/create-tab/components/combinedContent';
import { AssetTypeActions } from '../redux/actions';

class CreateAssetTypeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            domainParent: "",
            defaultInfo: [], 
            errorOnNameField: undefined, 
            errorOnValue: undefined,
        }
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.domainParent !== prevState.domainParent && nextProps.domainParent.length) {
            let dm = prevState.domainParent;
            return {
                ...prevState,
                domainParent: dm,
            }
        } else {
            return null;
        }
    }

    handleCode = (e) => {
        const value = e.target.value;
        this.setState({
            documentCode: value
        })
    }

    handleName = (e) => {
        const value = e.target.value;
        this.setState({
            documentName: value
        })
    }

    handleDescription = (e) => {
        const value = e.target.value;
        this.setState({
            documentDescription: value
        })
    }

    handleParent = (value) => {
        this.setState({ domainParent: value[0] });
    };
    
    /**
     * Bắt sự kiện click thêm Thông tin mặc định
     */
    handleAddDefaultInfo = () => {
        var defaultInfo = this.state.defaultInfo;

        if (defaultInfo.length !== 0) {
            let result;

            for (let n in defaultInfo) {
                result = this.validateNameField(defaultInfo[n].nameField, n) && this.validateValue(defaultInfo[n].value, n);
                if (!result) {
                    this.validateNameField(defaultInfo[n].nameField, n);
                    this.validateValue(defaultInfo[n].value, n)
                    break;
                }
            }

            if (result) {
                this.setState({
                    defaultInfo: [...defaultInfo, { nameField: "", value: "" }]
                })
            }
        } else {
            this.setState({
                defaultInfo: [...defaultInfo, { nameField: "", value: "" }]
            })
        }

    }

    /**
     * Bắt sự kiện chỉnh sửa tên trường dữ liệu thông tin mặc định
     */
    handleChangeNameField = (e, index) => {
        var { value } = e.target;
        this.validateNameField(value, index);
    }
    validateNameField = (value, className, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateNameField(value, this.props.translate);
        if (willUpdateState) {
            var { defaultInfo } = this.state;
            defaultInfo[className] = { ...defaultInfo[className], nameField: value }
            this.setState(state => {
                return {
                    ...state,
                    errorOnNameField: msg,
                    defaultInfo: defaultInfo
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện chỉnh sửa giá trị trường dữ liệu thông tin mặc định
     */
    handleChangeValue = (e, index) => {
        var { value } = e.target;
        this.validateValue(value, index);
    }
    validateValue = (value, className, willUpdateState = true) => {
        // let msg = AssetCreateValidator.validateValue(value, this.props.translate);
        let msg = undefined;
        if (willUpdateState) {
            var { defaultInfo } = this.state;
            defaultInfo[className] = { ...defaultInfo[className], value: value }
            this.setState(state => {
                return {
                    ...state,
                    errorOnValue: msg,
                    defaultInfo: defaultInfo
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện xóa thông tin mặc định
     */
    delete = (index) => {
        var { defaultInfo } = this.state;
        defaultInfo.splice(index, 1);
        this.setState({
            defaultInfo: defaultInfo
        })
        if (defaultInfo.length !== 0) {
            for (let n in defaultInfo) {
                this.validateNameField(defaultInfo[n].nameField, n);
                this.validateValue(defaultInfo[n].value, n)
            }
        } else {
            this.setState({
                errorOnValue: undefined,
                errorOnNameField: undefined
            })
        }
    };

    save = () => {
        const { documentCode, documentName, documentDescription, domainParent, defaultInfo } = this.state;
        this.props.createAssetTypes({
            typeNumber: documentCode,
            typeName: documentName,
            description: documentDescription,
            parent: domainParent ? domainParent : "",
            defaultInformation: defaultInfo,
        });
    }

    render() {
        const { translate, assetType } = this.props;
        const { domainParent, defaultInfo, errorOnNameField, errorOnValue } = this.state;

        const { list } = assetType.administration.types;

        let dataList = list.map(node => {
            return {
                ...node,
                id: node._id,
                name: node.typeName,
            }
        })

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-create-asset-type"
                    formID="form-create-asset-type"
                    title="Thêm mới loại tài sản"
                    func={this.save}
                >
                    {/* Thêm loại tài sản mới */}
                    <form id="form-create-asset-type">
                        {/* Mã loại tài sản */}
                        <div className="form-group">
                            <label>{translate('asset.asset_type.asset_type_code')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleCode} />
                        </div>

                        {/* Tên loại tài sản */}
                        <div className="form-group">
                            <label>{translate('asset.asset_type.asset_type_name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleName} />
                        </div>

                        {/* Loại tài sản cha */}
                        <div className="form-group">
                            <label>{translate('asset.asset_type.parent_asset_type')}</label>
                            <TreeSelect data={dataList} value={[domainParent]} handleChange={this.handleParent} mode="radioSelect" />
                        </div>

                        {/* Mô tả */}
                        <div className="form-group">
                            <label>{translate('asset.general_information.description')}</label>
                            <textarea style={{ minHeight: '100px' }} type="text" className="form-control" onChange={this.handleDescription} />
                        </div>

                        {/* Thông tin mặc định */}
                        <div className="form-group">
                            <label>Thông tin mặc định:<a style={{ cursor: "pointer" }} title='Thêm thông tin mặc định'><i className="fa fa-plus-square" style={{ color: "#00a65a", marginLeft: 5 }}
                                onClick={this.handleAddDefaultInfo} /></a></label>
                            <div className={`form-group ${(!errorOnNameField && !errorOnValue) ? "" : "has-error"}`}>

                                {/* Bảng thông tin chi tiết */}
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th style={{ paddingLeft: '0px' }}>{translate('asset.asset_info.field_name')}</th>
                                            <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(!defaultInfo || defaultInfo.length === 0) ? <tr>
                                            <td colSpan={3}>
                                                <center> {translate('table.no_data')}</center>
                                            </td>
                                        </tr> :
                                            defaultInfo.map((x, index) => {
                                                return <tr key={index}>
                                                    {/* Tên trường dữ liệu */}
                                                    <td style={{ paddingLeft: '0px' }}><input className="form-control" type="text" value={x.nameField} name="nameField" style={{ width: "100%" }} onChange={ (e) => this.handleChangeNameField(e, index)} /></td>
                                                    
                                                    {/* Hành động */}
                                                    <td style={{ textAlign: "center" }}>
                                                        <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                                    </td>
                                                </tr>
                                            })}
                                    </tbody>
                                </table>
                                <ErrorLabel content={errorOnNameField} />
                                <ErrorLabel content={errorOnValue} />
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    createAssetTypes: AssetTypeActions.createAssetTypes
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateAssetTypeModal));