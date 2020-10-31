import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import FileAddModal from './fileAddModal'
import FileEditModal from './fileEditModal'

class FileTabEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    static getDerivedStateFromProps(props, state) {
        const { id, files, customerIdEdit } = props;
        if (customerIdEdit !== state.customerIdEdit) {
            return {
                ...state,
                customerIdEdit,
                id,
                files,
            }
        } else {
            return null;
        }
    }

    /**
     * Hàm xử lý lưu các file được chọn vào state
     * @param {*} value 
     */
    handleAddFile = (value) => {
        let { files } = this.state;
        const { callBackFromParentEditForm } = this.props;

        files = [
            ...files,
            {
                name: value.name,
                description: value.description,
                fileName: value.fileName,
                url: value.urlFile,
                fileUpload: value.fileUpload,
            }
        ]

        this.setState({
            files,
        }, () => callBackFromParentEditForm('files', files));
    }

    /**
     * Hàm xử lý khi click vào nút edit
     * @param {*} data 
     * @param {*} index 
     */
    handleEdit = (data, index) => {
        this.setState({
            ...this.state,
            itemEdit: index + 1,
            data,
        }, () => window.$('#modal-fileEditModal').modal('show'))
    }

    /**
     * Lưu thông tin thay đổi vào state
     * @param {*} value 
     */
    handleEditChange = (value) => {
        const { callBackFromParentEditForm } = this.props;
        let { files } = this.state;

        files[value._id - 1] = value;
        this.setState({
            files,
        }, () => callBackFromParentEditForm('files', files))
    }

    render() {
        const { translate } = this.props;
        const { id, files, data, itemEdit } = this.state;
        return (
            <React.Fragment>
                <div id={id} className="tab-pane">
                    <div className="row">
                        <div className="col-md-12">
                            <h4 className="row col-md-6 col-xs-8">{translate('crm.customer.list_attachments')}:</h4>
                            <FileAddModal handleAddFileAttachment={this.handleAddFile} />
                            {itemEdit &&
                                <FileEditModal
                                    _id={itemEdit}
                                    data={data}
                                    handleEditChange={this.handleEditChange}
                                />
                            }

                            <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                                <thead>
                                    <tr>
                                        <th>{translate('crm.customer.file.name')}</th>
                                        <th>{translate('crm.customer.file.description')}</th>
                                        <th>{translate('crm.customer.file.attachment')}</th>
                                        <th style={{ width: '120px' }}>{translate('general.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        files && files.length > 0 ? files.map((o, index) => (
                                            <tr className={`item-${index}`} key={index}>
                                                <td>{o.name}</td>
                                                <td>{o.description}</td>
                                                <td><a href={`${o.url}`} target="_blank">{o.fileName}</a></td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <a className="text-yellow" onClick={() => this.handleEdit(o, index)}><i className="material-icons">edit</i></a>
                                                    <a className="text-danger" onClick={() => this.handleDelete(index)}><i className="material-icons">delete</i></a>
                                                </td>
                                            </tr>
                                        )) : null
                                    }
                                </tbody>
                            </table>
                            {files && files.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(FileTabEditForm));