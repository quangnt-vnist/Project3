import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import "./uploadFile.css"
class UploadFile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    };

    /** Bắt sự kiện thay đổi file đính kèm */
    handleUploadFile = (e) => {
        const { multiple = false, importFile } = this.props;
        let fileList = e.target.files;
        if (importFile) {
            importFile(fileList);
        };
        if (fileList.length !== 0) {
            for (let i = 0; i < fileList.length; i++) {
                let file = fileList[i];
                if (file) {
                    let url = URL.createObjectURL(file);
                    let fileLoad = new FileReader();
                    fileLoad.readAsDataURL(file);
                    fileLoad.onload = () => {
                        let item = { fileName: file.name, urlFile: url, fileUpload: file };
                        this.setState(state => {
                            if (!state.files) {
                                state.files = [];
                            }
                            return {
                                ...state,
                                files: multiple ? [...state.files, item] : [item]
                            }
                        })
                    };
                }
            }
        } else if (multiple === false) {
            this.setState({
                files: undefined
            })
        }
    }

    /**
     * Bắt sự kiện xóa file đính kèm
     * @param {*} name : Têm file muốn xoá
     */
    handleDeleteFile = (index) => {
        let { files } = this.state;
        let { deleteValue = true } = this.props;

        if (deleteValue) {
            files.splice(index, 1);
            this.setState({
                files: files
            })
        }

    };

    static isEqual = (items1, items2) => {
        if (!items1 || !items2) {
            return false;
        }
        if (items1.length !== items2.length) {
            return false;
        }
        for (let i = 0; i < items1.length; ++i) {
            if (items1[i].fileName !== items2[i].fileName) { // Kiểu bình thường
                return false;
            }
        }
        return true;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.files === undefined && nextProps.files && nextProps.files.length !== 0) {
            return {
                ...prevState,
                files: nextProps.files
            }
        }
        return null
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (!UploadFile.isEqual(nextState.files, this.state.files) && !nextProps.importFile) {
            this.props.onChange(nextState.files ? nextState.files : []);
        };
        if (nextState.files && nextState.files.length === 0 && !nextProps.importFile) {
            this.props.onChange(nextState.files ? nextState.files : []);
        }
        return true
    }

    render() {
        const { translate } = this.props;

        const { multiple = false, disabled = false, accept = '', deleteValue = true } = this.props;

        const { files } = this.state;

        return (
            <React.Fragment>
                <div className="form-group">
                    <div className="upload btn btn-primary" disabled={disabled} >
                        <i className="fa fa-folder"></i>
                        {" " + translate('document.choose_file')}
                        <input className="upload" type="file" name="file" accept={accept} disabled={disabled} style={{ cursor: disabled ? "not-allowed" : 'pointer' }}
                            onChange={this.handleUploadFile} multiple={multiple} />
                    </div>
                </div>
                {files && files.length ?
                    <div className="list-upload-file-cmc">
                        <ul className="ul-upload-file-cmc">
                            {files.map((child, index) => {
                                return (
                                    <li key={index}>
                                        <label className="delete-label-upfile-cmc">
                                            <a style={{ cursor: deleteValue ? "pointer" : 'text' }} title='Xóa file này'>
                                                <i className="fa fa-times" id="delete-icon-upload-cmc"
                                                    style={{ pointerEvents: deleteValue ? "" : "none" }}
                                                    onClick={(e) => this.handleDeleteFile(index)} />
                                            </a>
                                        </label>
                                        <a className="file-name-upfile">{child.fileName}</a>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    : null
                }

            </React.Fragment >
        );
    }
}

const mapState = state => state;
const UploadFileExport = connect(mapState, null)(withTranslate(UploadFile));

export { UploadFileExport as UploadFile }
