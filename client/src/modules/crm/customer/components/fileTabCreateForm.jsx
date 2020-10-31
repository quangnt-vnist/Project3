import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import FileAddModal from './fileAddModal';
import FileEditModal from './fileEditModal';

class FileTabCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listFiles: [],
        }
    }

    /**
     * Hàm xử lý lưu các file được chọn vào state
     * @param {*} value 
     */
    handleAddFile = (value) => {
        let { listFiles } = this.state;
        const { callBackFromParentCreateForm } = this.props;

        listFiles = [
            ...listFiles,
            {
                name: value.name,
                description: value.description,
                fileName: value.fileName,
                url: value.urlFile,
                fileUpload: value.fileUpload,
            }
        ]
        this.setState({
            listFiles,
        }, () => callBackFromParentCreateForm('files', listFiles));
    }

    /**
     * Hàm xóa file đã chọn
     * @param {*} index 
     */
    handleDelete = (index) => {
        let { listFiles } = this.state;
        const { callBackFromParentCreateForm } = this.props;
        // let fileItem = document.querySelector(`.item-${index}`);
        // fileItem.remove();
        listFiles.splice(index, 1);
        this.setState({
            listFiles,
        })

        callBackFromParentCreateForm('files', listFiles);
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
        const { callBackFromParentCreateForm } = this.props;
        let { listFiles } = this.state;

        listFiles[value._id - 1] = value;
        this.setState({
            listFiles,
        }, () => callBackFromParentCreateForm('files', listFiles))
    }

    render() {
        const { translate } = this.props;
        const { id } = this.props;
        const { listFiles, itemEdit, data } = this.state;

        return (
            <React.Fragment>
                <div id={id} className="tab-pane">
                    <div className="row">
                        <div className="col-md-12">
                            <h4 className="row col-md-6 col-xs-8">{translate('crm.customer.list_attachments')}:</h4>
                            <FileAddModal
                                handleAddFileAttachment={this.handleAddFile}

                            />
                            {itemEdit &&
                                <FileEditModal
                                    _id={itemEdit}
                                    data={data}
                                    callBackFromParentCreateForm={this.handleAddFile}
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
                                        listFiles && listFiles.length > 0 ? listFiles.map((o, index) => (
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
                            {listFiles && listFiles.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(FileTabCreateForm));