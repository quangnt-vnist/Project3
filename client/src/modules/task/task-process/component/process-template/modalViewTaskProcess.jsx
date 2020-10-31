import React, { Component } from "react";
import { connect } from 'react-redux';
import { getStorage } from '../../../../../config';
import { withTranslate } from "react-redux-multilingual";

import { DialogModal, SelectBox } from "../../../../../common-components";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { TaskProcessActions } from "../../redux/actions";
import { ViewTaskTemplate } from "../../../task-template/component/viewTaskTemplate";

import BpmnViewer from 'bpmn-js';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import customModule from '../custom-task-process-template';

var zlevel = 1;
class ModalViewTaskProcess extends Component {

    constructor(props) {
        super(props);
        let { data } = this.props;
        this.state = {
            userId: getStorage("userId"),
            currentRole: getStorage('currentRole'),
            showInfo: false,
            selectedView: 'info',
            info: data.tasks,
            xmlDiagram: data.xmlDiagram,
        }
        this.modeler = new BpmnModeler({
            additionalModules: [
                customModule,
                // { moveCanvas: ['value', null] }, // chặn chức năng kéo thả khung vẽ
                { zoomScroll: ['value', ''] }, // chặn chức năng lăn chuột, zoom on mouse wheel
            ]
        });
        this.generateId = 'viewprocess';
        this.modeler.importXML(this.props.xmlDiagram)
    }

    interactPopup = async (event) => {
        let element = event.element;

        this.setState(state => {
            return {
                ...state,
                id: element.businessObject.id
            }
        });
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.idProcess !== prevState.idProcess) {
            let info = {};
            let infoTask = nextProps.data.tasks; // TODO task list
            for (let i in infoTask) {
                info[`${infoTask[i].code}`] = infoTask[i];
            }
            return {
                ...prevState,
                idProcess: nextProps.idProcess,
                showInfo: false,
                info: info,
                processDescription: nextProps.data.processDescription ? nextProps.data.processDescription : '',
                processName: nextProps.data.processName ? nextProps.data.processName : '',
                viewer: nextProps.data.viewer ? nextProps.data.viewer.map(x=>x._id) : [],
                manager: nextProps.data.manager ? nextProps.data.manager.map(x=>x._id) : [],
                xmlDiagram: nextProps.data.xmlDiagram,
            }
        } else {
            return null;
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps?.idProcess !== this.state.idProcess) {
            this.modeler.importXML(nextProps.data.xmlDiagram);
            return true;
        }
        return true;
    }
    componentDidMount() {
        this.props.getAllUsers();
        this.modeler.attachTo('#' + this.generateId);

        let eventBus = this.modeler.get('eventBus')

        eventBus.on('shape.move.start', 100000, () => { return false });
        this.modeler.on('element.click', 1000, (e) => this.interactPopup(e));
    }

    interactPopup = (event) => {
        var element = event.element;
        let nameStr = element.type.split(':');
        this.setState(state => {
            if (element.type !== 'bpmn:Collaboration' && element.type !== 'bpmn:Process' && element.type !== 'bpmn:StartEvent' && element.type !== 'bpmn:EndEvent' && element.type !== 'bpmn:SequenceFlow') {
                return { ...state, showInfo: true, type: element.type, name: nameStr[1], taskName: element.businessObject.name, id: `${element.businessObject.id}`, }
            }
            else {
                return { ...state, showInfo: false, type: element.type, name: '', id: element.businessObject.id, }
            }

        })
    }

    // Các hàm xử lý sự kiện của form 
    handleChangeContent = async (content) => {
        await this.setState(state => {
            return {
                ...state,
                selectedView: content
            }
        })
    }


    handleZoomOut = async () => {
        let zstep = 0.2;
        let canvas = this.modeler.get('canvas');
        let eventBus = this.modeler.get('eventBus');

        // set initial zoom level
        canvas.zoom(zlevel, 'auto');

        // update our zoom level on viewbox change
        await eventBus.on('canvas.viewbox.changed', function (evt) {
            zlevel = evt.viewbox.scale;
        });
        zlevel = Math.max(zlevel - zstep, zstep);
        canvas.zoom(zlevel, 'auto');
    }

    handleZoomReset = () => {
        let canvas = this.modeler.get('canvas');
        canvas.zoom('fit-viewport');
    }

    handleZoomIn = async () => {
        let zstep = 0.2;
        let canvas = this.modeler.get('canvas');
        let eventBus = this.modeler.get('eventBus');

        // set initial zoom level
        canvas.zoom(zlevel, 'auto');
        // update our zoom level on viewbox change
        await eventBus.on('canvas.viewbox.changed', function (evt) {
            zlevel = evt.viewbox.scale;
        });

        zlevel = Math.min(zlevel + zstep, 7);
        canvas.zoom(zlevel, 'auto');
    }
    render() {
        const { translate, role, user } = this.props;
        const { listOrganizationalUnit } = this.props
        const { name, id, idProcess, info, showInfo, processDescription, processName, viewer, manager, selectedView } = this.state;

        let listRole = [];
        let listUser = user.list
        if (role && role.list.length !== 0) listRole = role.list;

        let listItem = listRole.filter(e => ['Admin', 'Super Admin', 'Dean', 'Vice Dean', 'Employee'].indexOf(e.name) === -1)
            .map(item => { return { text: item.name, value: item._id } });

        let listViewer = [];
        if (viewer) {
            listViewer = listItem.filter(e => viewer.indexOf(e.value) !== -1)
        }

        let listManager = [];
        if (manager) {
            listManager = listItem.filter(e => manager.indexOf(e.value) !== -1)
        }

        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID={`modal-view-process-task`}
                    isLoading={false}
                    formID="form-task-process"
                    title={this.props.title}
                    hasSaveButton={false}
                    bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
                >
                    <div>
                        <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none", marginBottom: 0 }}>
                            <ul className="nav nav-tabs">
                                <li className="active"><a href="#info-view" onClick={() => this.handleChangeContent("info")} data-toggle="tab">{translate("task.task_process.process_information")}</a></li>
                                <li><a href="#process-view" onClick={() => this.handleChangeContent("process")} data-toggle="tab">{translate("task.task_process.task_process")}</a></li>
                            </ul>
                            <div className="tab-content">
                                <div className={selectedView === "info" ? "active tab-pane" : "tab-pane"} id="info-view">
                                    <div className="description-box without-border">
                                        {/* Thông tin chung */}
                                        <div>
                                            <strong>{translate("task.task_process.process_name")}:</strong>
                                            <span>{processName}</span>
                                        </div>
                                        <div>
                                            <strong>{translate("task.task_process.process_description")}:</strong>
                                            <span>{processDescription}</span>
                                        </div>


                                        {/* Người xem, quản lý */}
                                        <strong>{translate("task.task_process.viewer")}:</strong>
                                        <ul>
                                            {
                                                listViewer.map((x, key) => {
                                                    return <li key={key}>{x.text}</li>
                                                })
                                            }
                                        </ul>
                                        <strong>{translate("task.task_process.manager")}:</strong>
                                        <ul>
                                            {
                                                listManager.map((x, key) => {
                                                    return <li key={key}>{x.text}</li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>


                            <div className="tab-content" style={{ padding: 0, marginTop: -15 }}>
                                <div className={selectedView === "process" ? "active tab-pane" : "tab-pane"} id="process-view">
                                    <div className="">
                                        {/* Quy trình công việc */}
                                        <div className={`contain-border ${showInfo ? 'col-md-8' : 'col-md-12'}`}>
                                            <div className="tool-bar-xml" style={{ /*position: "absolute", right: 5, top: 5*/ }}>
                                                <button onClick={this.exportDiagram}>Export XML</button>
                                                <button onClick={this.downloadAsSVG}>Save SVG</button>
                                                <button onClick={this.downloadAsImage}>Save Image</button>
                                                <button onClick={this.downloadAsBpmn}>Download BPMN</button>
                                            </div>
                                            <div id={this.generateId}></div>
                                            <div className="row">
                                                <div className="io-zoom-controls">
                                                    <ul className="io-zoom-reset io-control io-control-list">
                                                        <li>
                                                            <a style={{ cursor: "pointer" }} title="Reset zoom" onClick={this.handleZoomReset}>
                                                                <i className="fa fa-crosshairs"></i>
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a style={{ cursor: "pointer" }} title="Zoom in" onClick={this.handleZoomIn}>
                                                                <i className="fa fa-plus"></i>
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a style={{ cursor: "pointer" }} title="Zoom out" onClick={this.handleZoomOut}>
                                                                <i className="fa fa-minus"></i>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`right-content ${showInfo ? 'col-md-4' : undefined}`}>
                                            {
                                                (showInfo) &&
                                                <div>
                                                    {/* <div>
                                                        <h1>Option {name}</h1>
                                                    </div> */}
                                                    <ViewTaskTemplate
                                                        isProcess={true}
                                                        taskTemplate={info?.[`${id}`]}
                                                        listUser={listUser}
                                                    />
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { user, auth, role } = state;
    return { user, auth, role };
}

const actionCreators = {
    getDepartment: UserActions.getDepartmentOfUser,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    createXmlDiagram: TaskProcessActions.createXmlDiagram,
    getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
    editXmlDiagram: TaskProcessActions.editXmlDiagram,
    getAllUsers: UserActions.get
};
const connectedModalAddProcess = connect(mapState, actionCreators)(withTranslate(ModalViewTaskProcess));
export { connectedModalAddProcess as ModalViewTaskProcess };
