import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AuthActions } from '../../../../auth/redux/actions';

class AttachmentTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
        const { id } = this.props;
        const { translate } = this.props;
        const { files, archivedRecordNumber } = this.state;

        return (
            <div id={id} className="tab-pane">
                <div className="row box-body">
                    {/* Danh sách tài liệu đính kèm */}
                    <div className="col-md-12">
                        {/* Bảng tài liệu đính kèm */}
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('asset.general_information.file_name')}</th>
                                    <th>{translate('asset.general_information.description')}</th>
                                    <th>{translate('asset.general_information.attached_file')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(files && files.length !== 0) &&
                                    files.map((x, index) => {
                                        return <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.description}</td>
                                            <td>{!(x.files && x.files.length) ? translate('human_resource.profile.no_files') :
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
            </div>

        );
    }
};

const actionCreators = {
    downloadFile: AuthActions.downloadFile,
};

const tabAttachments = connect(null, actionCreators)(withTranslate(AttachmentTab));

export { tabAttachments as AttachmentTab };