import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ApiImage, Comment } from '../../../../common-components'
import { withTranslate } from "react-redux-multilingual";
import { AuthActions } from '../../../auth/redux/actions';
import { performTaskAction } from '../redux/actions';
import { CommentInProcess } from './commentInProcess';
class OutgoingDataTab extends Component {

    constructor(props) {
        super(props);

        this.DOCUMENT = [];
        this.INFORMATION = [];

        this.state = {
            taskId: undefined,
            task: undefined,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isOutgoingData && nextProps.taskId !== prevState.taskId) {
            let isOutputInformation = {}, isOutputDocument = {};

            if (nextProps.task && nextProps.task.taskInformations && nextProps.task.taskInformations.length !== 0) {
                nextProps.task.taskInformations.map(item => {
                    let element = {};
                    element[item._id] = item.isOutput;

                    isOutputInformation = Object.assign(isOutputInformation, element);
                });
            }

            if (nextProps.task && nextProps.task.documents && nextProps.task.documents.length !== 0) {
                nextProps.task.documents.map(item => {
                    let element = {};
                    element[item._id] = item.isOutput;

                    isOutputDocument = Object.assign(isOutputDocument, element);
                });
            }

            return {
                ...prevState,
                taskId: nextProps.taskId,
                task: nextProps.task,
                isOutputInformation: isOutputInformation,
                isOutputDocument: isOutputDocument
            }
        } else {
            return null
        }
    }

    handleCheckBoxOutputInformation = (info) => {
        this.setState(state => {
            state.isOutputInformation[info._id] = !state.isOutputInformation[info._id];
            return {
                ...state,
            }
        })

        let check = [], element;

        check = this.INFORMATION.filter(item => {
            if (item._id === info._id) {
                element = item;
                return true
            } else {
                return false
            }
        });

        if (check.length !== 0) {
            this.INFORMATION.splice(this.INFORMATION.indexOf(element), 1);
        } else {
            let data = {
                _id: info._id,
                description: info.description,
                isOutput: !info.isOutput,
                name: info.name,
                type: info.type
            }

            this.INFORMATION.push(data);
        }
    }

    handleCheckBoxOutputDocument = (document) => {
        this.setState(state => {
            state.isOutputDocument[document._id] = !state.isOutputDocument[document._id];
            return {
                ...state,
            }
        })

        let check = [], element;

        check = this.DOCUMENT.filter(item => {
            if (item._id === document._id) {
                element = item;
                return true
            } else {
                return false
            }
        });

        if (check.length !== 0) {
            this.DOCUMENT.splice(this.DOCUMENT.indexOf(element), 1);
        } else {
            let data = {
                _id: document._id,
                description: document.description,
                isOutput: !document.isOutput,
            }

            this.DOCUMENT.push(data);
        }
    }

    handleSaveEdit = () => {
        const { task } = this.state;

        if (this.INFORMATION.length !== 0) {
            this.props.editInformationTask(task._id, this.INFORMATION);
            this.INFORMATION = [];
        }

        if (this.DOCUMENT.length !== 0) {
            this.props.editDocument(undefined, task._id, this.DOCUMENT)
            this.DOCUMENT = [];
        }
    }
    requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        this.props.downloadFile(path, fileName)
    }
    isImage = (src) => {
        let string = src.split(".")
        let image = ['jpg', 'jpeg', 'png', 'tiff', 'gif']
        if (image.indexOf(string[string.length - 1]) !== -1) {
            return true;
        } else {
            return false;
        }
    }
    render() {
        const { translate, performtasks } = this.props;
        const { task, isOutputInformation, isOutputDocument } = this.state;
        let task1 = performtasks?.task
        return (
            <React.Fragment>
                {
                    task1 &&
                    <React.Fragment>
                        <div className="description-box outgoing-content">
                            <h4>{translate('task.task_process.list_of_data_and_info')}</h4>

                            <strong>{translate('task.task_process.information')}:</strong>
                            { /** Danh sách thông tin */
                                task1.taskInformations
                                    && task1.taskInformations.length !== 0
                                    ? task1.taskInformations.map((info) =>
                                        <div>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    title={translate('task.task_process.export_info')}
                                                    name={info.description}
                                                    onClick={() => this.handleCheckBoxOutputInformation(info)}
                                                    checked={isOutputInformation[info._id]}
                                                />
                                                <strong>{info.name}:</strong>
                                            </label>
                                            <span>{info.value}</span>
                                        </div>
                                    )
                                    : <span>{translate('task.task_process.not_have_info')}</span>
                            }

                            <div style={{ marginTop: 10 }}></div>
                            <strong>{translate('task.task_process.document')}:</strong>
                            { /** Danh sách tài liệu */
                                task1.documents
                                    && task1.documents.length !== 0
                                    ? task1.documents.map((document, index) =>
                                        <div key={index}>
                                            <div>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        title={translate('task.task_process.export_doc')}
                                                        name={document.description}
                                                        onClick={() => this.handleCheckBoxOutputDocument(document)}
                                                        checked={isOutputDocument[document._id]}
                                                    />
                                                    <strong>{document.description} ({document.files.length} tài liệu)</strong>
                                                </label>
                                            </div>

                                            {
                                                document.files && document.files.length !== 0
                                                && document.files.map((file, index) =>
                                                    <div key={index}>
                                                        {this.isImage(file.name) ?
                                                            <ApiImage
                                                                className="attachment-img files-attach"
                                                                style={{ marginTop: "5px" }}
                                                                src={file.url}
                                                                file={file}
                                                                requestDownloadFile={this.requestDownloadFile}
                                                            />
                                                            :
                                                            <a style={{ cursor: "pointer" }} style={{ marginTop: "2px" }} onClick={(e) => this.requestDownloadFile(e, file.url, file.name)}> {file.name} </a>
                                                        }
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                    : <span>{translate('task.task_process.not_have_doc')}</span>
                            }
                            <div style={{ marginTop: 20 }}>
                                <button type="button" style={{ width: "100%" }} className="btn btn-block btn-default" onClick={() => this.handleSaveEdit()} disabled={this.DOCUMENT.length === 0 && this.INFORMATION.length === 0}>{translate('task.task_process.save')}</button>
                            </div>


                        </div>

                        { /** Trao đổi */}
                        <div>
                            <h4 style={{ marginBottom: "1.3em" }}>Trao đổi với các công việc khác về dữ liệu ra</h4>
                            {/* <CommentInProcess
                                task={performtasks.task}
                                inputAvatarCssClass="user-img-outgoing-level1"
                            /> */}
                            <Comment
                                data={task1}
                                comments={task1.commentsInProcess}
                                type="outgoing"
                                createComment={(dataId, data, type) => this.props.createComment(dataId, data, type)}
                                editComment={(dataId, commentId, data, type) => this.props.editComment(dataId, commentId, data, type)}
                                deleteComment={(dataId, commentId, type) => this.props.deleteComment(dataId, commentId, type)}
                                createChildComment={(dataId, commentId, data, type) => this.props.createChildComment(dataId, commentId, data, type)}
                                editChildComment={(dataId, commentId, childCommentId, data, type) => this.props.editChildComment(dataId, commentId, childCommentId, data, type)}
                                deleteChildComment={(dataId, commentId, childCommentId, type) => this.props.deleteChildComment(dataId, commentId, childCommentId, type)}
                                deleteFileComment={(fileId, commentId, dataId, type) => this.props.deleteFileComment(fileId, commentId, dataId,type)}
                                deleteFileChildComment={(fileId, commentId, childCommentId, dataId, type) => this.props.deleteFileChildComment(fileId, commentId, childCommentId, dataId, type)}
                                downloadFile={(path, fileName) => this.props.downloadFile(path, fileName)}
                            />
                        </div>
                    </React.Fragment>

                }
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { performtasks } = state;
    return { performtasks };
}
const actions = {
    editDocument: performTaskAction.editDocument,
    editInformationTask: performTaskAction.editInformationTask,
    downloadFile: AuthActions.downloadFile,
    createComment: performTaskAction.createComment,
    editComment: performTaskAction.editComment,
    deleteComment: performTaskAction.deleteComment,
    createChildComment: performTaskAction.createChildComment,
    editChildComment: performTaskAction.editChildComment,
    deleteChildComment: performTaskAction.deleteChildComment,
    deleteFileComment: performTaskAction.deleteFileComment,
    deleteFileChildComment: performTaskAction.deleteFileChildComment,
}

const connectOutgoingDataTab = connect(mapState, actions)(withTranslate(OutgoingDataTab));
export { connectOutgoingDataTab as OutgoingDataTab }