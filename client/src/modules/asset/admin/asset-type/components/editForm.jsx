import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { TreeSelect, ErrorLabel } from '../../../../../common-components';

import { AssetCreateValidator } from '../../../base/create-tab/components/combinedContent';
import { AssetTypeActions } from '../redux/actions';

class EditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleCode = (e) => {
        const value = e.target.value;
        this.setState({
            domainCode: value
        })
    }

    handleName = (e) => {
        const value = e.target.value;
        this.setState({
            domainName: value
        })
    }

    validateName = async (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = "hello world";
        }
        if (willUpdateState) {
            await this.setState(state => {
                return {
                    ...state,
                    domainName: value,
                    errorName: msg
                }
            })
        }

        return msg === undefined;
    }

    handleValidateName = (e) => {
        const value = e.target.value.trim();
        this.validateName(value, true);
    }

    isValidateForm = () => {
        return this.validateName(this.state.domainName, false);
    }

    handleDescription = (e) => {
        const value = e.target.value;
        this.setState({
            domainDescription: value
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
                result = this.validateNameField(defaultInfo[n].nameField, n);
                if (!result) {
                    this.validateNameField(defaultInfo[n].nameField, n);
                    break;
                }
            }

            if (result) {
                this.setState({
                    defaultInfo: [...defaultInfo, { nameField: "" }]
                })
            }
        } else {
            this.setState({
                defaultInfo: [...defaultInfo, { nameField: "" }]
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
                    errorPosition: msg ? className : null,
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
            }
        } else {
            this.setState({
                errorOnValue: undefined,
                errorOnNameField: undefined
            })
        }
    };

    save = () => {
        const { domainId, domainCode, domainName, domainDescription, domainParent, defaultInfo } = this.state;
        this.props.editAssetType(domainId, {
            typeNumber: domainCode,
            typeName: domainName,
            description: domainDescription,
            parent: domainParent,
            defaultInformation: defaultInfo,
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.domainId !== prevState.domainId) {
            return {
                ...prevState,
                domainId: nextProps.domainId,
                domainChild: nextProps.domainChild,
                domainCode: nextProps.domainCode,
                domainName: nextProps.domainName,
                domainDescription: nextProps.domainDescription,
                domainParent: nextProps.domainParent,
                defaultInfo: nextProps.defaultInformation,
                errorName: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, assetType } = this.props;
        const { tree, list } = assetType.administration.types;
        const { domainId, domainChild, domainCode, domainName, domainDescription, domainParent, errorName, defaultInfo, errorOnNameField, errorPosition } = this.state;

        let cannotChoose = [domainId];
        let dataList = [];

        if (domainChild.length) {
            for (let i in domainChild) {
                cannotChoose.push(domainChild[i]);
            }
        }

        for (let i in list) {
            if (cannotChoose.indexOf(list[i]._id) < 0) {
                dataList.push({
                    ...list[i],
                    id: list[i]._id,
                    name: list[i].typeName
                })
            }
        }

        return (
            <div id="edit-asset-type">
                {/* Mã loại tài sản */}
                <div className="form-group">
                    <label>{translate('asset.asset_type.asset_type_code')}<span className="text-red">*</span></label>
                    <input type="text" className="form-control" onChange={this.handleCode} value={domainCode} />
                </div>

                {/* Tên loại tài sản */}
                <div className="form-group">
                    <label>{translate('asset.asset_type.asset_type_name')}<span className="text-red">*</span></label>
                    <input type="text" className="form-control" onChange={this.handleName} value={domainName} />
                </div>

                {/* Loại tài sản cha */}
                <div className="form-group">
                    <label>{translate('asset.asset_type.parent_asset_type')}</label>
                    <TreeSelect data={dataList} value={[domainParent]} handleChange={this.handleParent} mode="radioSelect" />
                </div>

                {/* Mô tả */}
                <div className="form-group">
                    <label>{translate('asset.general_information.description')}</label>
                    <textarea style={{ minHeight: '120px' }} type="text" className="form-control" onChange={this.handleDescription} value={domainDescription} />
                </div>

                {/* Thông tin mặc định */}
                <div className="form-group">
                    <label>Các thuộc tính mặc định:<a style={{ cursor: "pointer" }} title='Thêm thuộc tính mặc định'><i className="fa fa-plus-square" style={{ color: "#00a65a", marginLeft: 5 }}
                        onClick={this.handleAddDefaultInfo} /></a></label>

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
                                        <td style={{ paddingLeft: '0px' }}>
                                            <div className={`form-group ${(parseInt(errorPosition) === index && errorOnNameField) ? "has-error" : ""}`}>
                                                <input className="form-control" type="text" value={x.nameField} name="nameField" style={{ width: "100%" }} onChange={(e) => this.handleChangeNameField(e, index)} />
                                                {(parseInt(errorPosition) === index && errorOnNameField) && <ErrorLabel content={errorOnNameField} />}
                                            </div>
                                        </td>

                                        {/* Hành động */}
                                        <td style={{ textAlign: "center" }}>
                                            <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                        </td>
                                    </tr>
                                })}
                        </tbody>
                    </table>
                </div>

                {/* Button */}
                <div className="form-group">
                    <button className="btn btn-success pull-right" style={{ marginLeft: '5px' }} onClick={this.save}>{translate('asset.general_information.save')}</button>
                    <button className="btn btn-danger" onClick={() => {
                        window.$(`#edit-asset-type`).slideUp()
                    }}>{translate('asset.general_information.cancel')}</button>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { assetType } = state;
    return { assetType };
}

const mapDispatchToProps = {
    editAssetType: AssetTypeActions.editAssetType
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm));