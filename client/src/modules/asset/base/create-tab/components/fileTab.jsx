import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { FileAddModal, FileEditModal } from './combinedContent';

import { AuthActions } from '../../../../auth/redux/actions';

class FileTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // Bắt sự kiện click edit khen thưởng
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-file-editFile${index}`).modal('show');
    }

    // Function lưu các trường thông tin vào state
    handleChange = (e) => {
        const { name, value } = e.target;
        this.props.handleChange(name, value);
    }

    // Function thêm tài liệu đính kèm mặc định
    defaulteClick = async (e) => {
        var { translate } = this.props;
        e.preventDefault();

        const defaulteFile = [
            { name: "Hợp đồng mua hàng", description: "Hợp đồng mua hàng", files: [] },
            { name: "Ảnh", description: "Ảnh của tài sản", files: [] },
            { name: "Tài liệu hướng dẫn sử dụng", description: "Tài liệu hướng dẫn sử dụng", files: [] },
        ]

        await this.setState({
            files: [...this.state.files, ...defaulteFile]
        })

        this.props.handleAddFile(this.state.files)
    }

    // Function thêm thông tin tài liệu đính kèm
    handleAddFile = async (data) => {
        let { files } = this.state;
        if (!files) {
            files = [];
        }

        await this.setState(state => {
            return {
                ...state,
                files: [...files, {
                    ...data
                }]
            }
        })
        this.props.handleAddFile(this.state.files, data)
    }

    // Function chỉnh sửa thông tin tài liệu đính kèm
    handleEditFile = async (data) => {
        const { files } = this.state;
        files[data.index] = data;
        await this.setState({
            files: files
        })
        this.props.handleEditFile(this.state.files, data)
    }

    // Function xoá thông tin tài liệu đính kèm
    handleDeleteFile = async (index) => {
        var { files } = this.state;
        var data = files[index];
        files.splice(index, 1);
        await this.setState({
            ...this.state,
            files: [...files]
        })
        this.props.handleDeleteFile(this.state.files, data)
    }

    requestDownloadFile = (e, path, fileName) => {
        e.preventDefault();
        this.props.downloadFile(path, fileName);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                files: nextProps.files,
                archivedRecordNumber: nextProps.archivedRecordNumber,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id, translate } = this.props;
        const { files, archivedRecordNumber, currentRow } = this.state;

        return (
            <div id={id} className="tab-pane">
                <div className=" row box-body">

                    {/* Danh sách tài liệu đính kèm */}
                    <div className="col-md-12">
                        {/* Form thêm tài liệu đính kèm */}
                        <FileAddModal handleChange={this.handleAddFile} id={`addFile${id}`} />
                        {/* Button mặc định */}
                        <button style={{ marginTop: 2, marginBottom: 10, marginRight: 15 }} type="submit" className="btn btn-primary pull-right" onClick={this.defaulteClick} title={translate('manage_asset.add_default_title')}>{translate('manage_asset.add_default')}</button>

                        {/* Bảng tài liệu đính kèm */}
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('asset.general_information.file_name')}</th>
                                    <th>{translate('asset.general_information.description')}</th>
                                    <th>{translate('asset.general_information.attached_file')}</th>
                                    <th style={{ width: '120px' }}>{translate('table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(files && files.length !== 0) &&
                                    files.map((x, index) => {
                                        return <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.description}</td>
                                            <td>{!(x.files && x.files.length) ? translate('confirm.no_data') :
                                                <ul style={{ listStyle: 'none' }}>
                                                    {x.files.map((child, index) => {
                                                        return (
                                                            <React.Fragment>
                                                                <li>
                                                                    <a style={{ cursor: "pointer" }} onClick={(e) => this.requestDownloadFile(e, child.url, child.fileName)} >{child.fileName}</a>
                                                                </li>
                                                            </React.Fragment>
                                                        )
                                                    })}
                                                </ul>
                                            }</td>
                                            <td >
                                                <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('asset.general_information.edit_document')}><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteFile(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                        {
                            (!files || files.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </div>
                </div>

                {/* Form chỉnh sửa tài liệu đính kèm */}
                {
                    currentRow &&
                    <FileEditModal
                        id={`editFile${currentRow.index}`}
                        _id={currentRow._id}
                        index={currentRow.index}
                        name={this.state.currentRow.name}
                        description={currentRow.description}
                        files={currentRow.files}
                        handleEditFile={this.handleEditFile}
                    />
                }
            </div>
        );
    }
};

const actionCreators = {
    downloadFile: AuthActions.downloadFile,
};

const fileTab = connect(null, actionCreators)(withTranslate(FileTab));
export { fileTab as FileTab };