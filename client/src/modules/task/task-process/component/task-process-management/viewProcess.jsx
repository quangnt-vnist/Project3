import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { getStorage } from '../../../../../config';
import { ModalDetailTask } from "../../../task-dashboard/task-personal-dashboard/modalDetailTask";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { performTaskAction } from "../../../task-perform/redux/actions";
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'
import BpmnModeler from 'bpmn-js/lib/Modeler';
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import customModule from '../custom-task-process'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import './../process-template/processDiagram.css';

//Xóa element khỏi pallette theo data-action
var _getPaletteEntries = PaletteProvider.prototype.getPaletteEntries;
PaletteProvider.prototype.getPaletteEntries = function (element) {
    var entries = _getPaletteEntries.apply(this);
    delete entries['create.subprocess-expanded'];
    delete entries['create.data-store'];
    delete entries['create.data-object'];
    delete entries['create.group'];
    delete entries['create.participant-expanded'];
    return entries;
}

// khởi tạo giá trị mặc định zoomIn zoomOut
var zlevel = 1;

class ViewProcess extends Component {

    constructor(props) {
        super(props);
        let { data } = this.props;

        this.state = {
            userId: getStorage("userId"),
            currentRole: getStorage('currentRole'),
            showInfo: false,
            info: data.tasks,
            xmlDiagram: data.xmlDiagram,
            selected: 'info',
            zlevel: 1,
            startDate: "",
            endDate: "",
            status: "",
        }
        this.modeler = new BpmnModeler({
            additionalModules: [
                customModule,
                { zoomScroll: ['value', ''] },
                // { moveCanvas: [ 'value', null ] }
            ],
        });
        this.generateId = 'viewtaskprocesstab';
        this.modeling = this.modeler.get("modeling");
        this.initialDiagram = data.xmlDiagram;
    }

    componentDidMount() {

        this.modeler.attachTo('#' + this.generateId);
        var eventBus = this.modeler.get('eventBus');

        //Vo hieu hoa double click edit label
        eventBus.on('element.dblclick', 10000, function (event) {
            var element = event.element;
            if (isAny(element, ['bpmn:Task'])) {
                return false; // will cancel event
            }
        });

        eventBus.on('shape.move.start', 100000, () => { return false });

        this.modeler.on('element.click', 1000, (e) => this.interactPopup(e));
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.idProcess !== prevState.idProcess) {
            let info = {};
            let infoTask = nextProps.data.tasks;
            for (let i in infoTask) {
                info[`${infoTask[i].codeInProcess}`] = infoTask[i];
            }
            return {
                ...prevState,
                idProcess: nextProps.idProcess,
                showInfo: false,
                info: info,
                processDescription: nextProps.data.processDescription ? nextProps.data.processDescription : '',
                processName: nextProps.data.processName ? nextProps.data.processName : '',
                status: nextProps.data.status ? nextProps.data.status : '',
                startDate: nextProps.data.startDate ? nextProps.data.startDate : '',
                endDate: nextProps.data.endDate ? nextProps.data.endDate : '',
                xmlDiagram: nextProps.data.xmlDiagram,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.idProcess !== this.state.idProcess) {
            this.props.getDepartment();
            let { user } = this.props;
            let defaultUnit;
            if (user && user.organizationalUnitsOfUser) defaultUnit = user.organizationalUnitsOfUser.find(item =>
                item.dean === this.state.currentRole
                || item.viceDean === this.state.currentRole
                || item.employee === this.state.currentRole);
            if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
                // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
                defaultUnit = user.organizationalUnitsOfUser[0]
            }
            this.props.getChildrenOfOrganizationalUnits(defaultUnit && defaultUnit._id);
            return true;
        }
        if (nextProps.data) {
            let modeler = this.modeler;
            let modeling = this.modeling;
            let state = this.state;
            this.modeler.importXML(nextProps.data.xmlDiagram, function (err) {
                let infoTask = nextProps.data.tasks
                let info = state.info;

                if (infoTask) {
                    for (let i in infoTask) {
                        let responsible = []
                        let accountable = []
                        infoTask[i].responsibleEmployees.forEach(x => {
                           responsible.push(x.name)
                        })
                        infoTask[i].accountableEmployees.forEach(x => {
                            accountable.push(x.name)
                         })
                        let element1 = (Object.keys(modeler.get('elementRegistry')).length > 0) && modeler.get('elementRegistry').get(infoTask[i].codeInProcess);
                        element1 && modeling.updateProperties(element1, {
                            progress: infoTask[i].progress,
                            shapeName: infoTask[i].name,
                            // responsibleName: responsible,
                            // accountableName: accountable
                        });
                        if (infoTask[i].status === "finished") {
                            element1 && modeling.setColor(element1, {
                                fill: '#f9f9f9',
                                stroke: '#c4c4c7'
                            });

                            var outgoing = element1.outgoing;
                            outgoing.forEach(x => {
                                if (info[x.businessObject.targetRef.id].status === "inprocess") {
                                    var outgoingEdge = modeler.get('elementRegistry').get(x.id);

                                    modeling.setColor(outgoingEdge, {
                                        stroke: '#c4c4c7',
                                        width: '5px'
                                    })
                                }
                            })
                        }
                        if (infoTask[i].status === "inprocess") {
                            element1 && modeling.setColor(element1, {
                                fill: '#84ffb8',
                                stroke: '#14984c', //E02001
                                width: '5px'
                            });

                        }
                    }
                }

            });
            return true;
        }
        return true;
    }

    // Các hàm  xử lý sự kiện của bpmn

    interactPopup = (event) => {
        var element = event.element;
        let nameStr = element.type.split(':');
        this.setState(state => {
            if (element.type === 'bpmn:Task' || element.type === 'bpmn:ExclusiveGateway') {
                if (!state.info[`${element.businessObject.id}`] || (state.info[`${element.businessObject.id}`] && !state.info[`${element.businessObject.id}`].organizationalUnit)) {
                    state.info[`${element.businessObject.id}`] = {
                        ...state.info[`${element.businessObject.id}`],
                        organizationalUnit: this.props.listOrganizationalUnit[0]?._id,
                    }
                }
                return {
                    ...state,
                    showInfo: true,
                    type: element.type,
                    name: nameStr[1],
                    taskName: element.businessObject.name,
                    id: `${element.businessObject.id}`,
                }
            }

            else {
                return { ...state, showInfo: false, type: element.type, name: '', id: element.businessObject.id, }
            }

        })
        if (element.type === 'bpmn:Task' || element.type === 'bpmn:ExclusiveGateway') {
            window.$(`#modal-detail-task-view-process`).modal("show");
        }
    }

    downloadAsSVG = () => {
        this.modeler.saveSVG({ format: true }, function (error, svg) {
            if (error) {
                return;
            }

            var svgBlob = new Blob([svg], {
                type: 'image/svg+xml'
            });

            var fileName = Math.random(36).toString().substring(7) + '.svg';

            var downloadLink = document.createElement('a');
            downloadLink.download = fileName;
            downloadLink.innerHTML = 'Get BPMN SVG';
            downloadLink.href = window.URL.createObjectURL(svgBlob);
            downloadLink.onclick = function (event) {
                document.body.removeChild(event.target);
            };
            downloadLink.style.visibility = 'hidden';
            document.body.appendChild(downloadLink);
            downloadLink.click();
        });
    }

    downloadAsBpmn = () => {
        this.modeler.saveXML({ format: true }, function (error, xml) {
            if (error) {
                return;
            }
        });
    }

    downloadAsImage = () => {
        this.modeler.saveSVG({ format: true }, function (error, svg) {
            if (error) {
                return;
            }
            function triggerDownload(imgURI) {
                var evt = new MouseEvent('click', {
                    view: window,
                    bubbles: false,
                    cancelable: true
                });

                var a = document.createElement('a');
                a.setAttribute('download', 'MY_COOL_IMAGE.png');
                a.setAttribute('href', imgURI);
                a.setAttribute('target', '_blank');

                a.dispatchEvent(evt);
            }
            var canvas = document.createElement("CANVAS");
            var ctx = canvas.getContext('2d');
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
            var DOMURL = window.URL || window.webkitURL || window;

            var img = new Image();
            var svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
            var url = DOMURL.createObjectURL(svgBlob);

            img.onload = function () {

                DOMURL.revokeObjectURL(url);
                ctx.drawImage(img, 0, 0);
                var imgURI = canvas
                    .toDataURL('image/png')
                    .replace('image/png', 'image/octet-stream');

                triggerDownload(imgURI);
            };

            img.src = url;
        });
    }

    // các hàm thu nhỏ, phóng to, vừa màn hình cho diagram
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

    exportDiagram = () => {
        let xmlStr;
        this.modeler.saveXML({ format: true }, function (err, xml) {
            if (err) {
            }
            else {
                xmlStr = xml;
            }
        });
        this.setState(state => {
            return {
                ...state,
                xmlDiagram: xmlStr,
            }
        })
    }


    formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    formatStatus = (data) => {
        const { translate } = this.props;
        if (data === "inprocess") return translate('task.task_management.inprocess');
        else if (data === "wait_for_approval") return translate('task.task_management.wait_for_approval');
        else if (data === "finished") return translate('task.task_management.finished');
        else if (data === "delayed") return translate('task.task_management.delayed');
        else if (data === "canceled") return translate('task.task_management.canceled');
    }

    render() {
        const { translate, role, user } = this.props;
        const { id, info, startDate, endDate, status,
                processDescription, processName } = this.state;
        const { isTabPane } = this.props

        return (
            <React.Fragment>
                <div>
                    {id !== undefined &&
                        <ModalDetailTask action={"view-process"} task={(info && info[`${id}`]) && info[`${id}`]} isProcess={true} />
                    }

                    <div className={`${isTabPane ? 'is-tabbed-pane' : 'row'}`}>
                        {/* Quy trình công việc */}
                        <div className={`contain-border ${isTabPane ? '' : 'col-md-8'}`}>
                            {/* Diagram */}
                            <div id={this.generateId}></div>
                            {/* Zoom button */}
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

                        <div className={`${isTabPane? "": "col-md-4"}`}>
                            <div className='description-box without-border'>
                                {/* tên quy trình */}
                                <div>
                                    <strong>{translate("task.task_process.process_name")}:</strong>
                                    <span>{processName}</span>
                                </div>

                                {/* mô tả quy trình */}
                                <div>
                                    <strong>{translate("task.task_process.process_description")}:</strong>
                                    <span>{processDescription}</span>
                                </div>

                                {/* mô tả quy trình */}
                                <div>
                                    <strong>{translate("task.task_process.process_status")}:</strong>
                                    <span>{this.formatStatus(status)}</span>
                                </div>

                                {/* thời gian thực hiện quy trình */}
                                <div>
                                    <strong>{translate("task.task_process.time_of_process")}:</strong>
                                    <span>{this.formatDate(startDate)} <i className="fa fa-fw fa-caret-right"></i> {this.formatDate(endDate)}</span>
                                </div>

                                <div>
                                    <strong>{translate("task.task_process.notice")}:</strong>
                                </div>
                                
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <div style={{ backgroundColor: "#fff", height: "30px", width: "40px", border: "2px solid #000", borderRadius: "3px", marginRight: "5px", marginTop: 4 }}></div>{translate("task.task_process.wait_for_approval")}
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <div style={{ backgroundColor: "#84ffb8", height: "30px", width: "40px", border: "2px solid #14984c", borderRadius: "3px", marginRight: "5px", marginTop: 4 }}></div>{translate("task.task_process.inprocess")}
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <div style={{ backgroundColor: "#f9f9f9", height: "30px", width: "40px", border: "2px solid #c4c4c7", borderRadius: "3px", marginRight: "5px", marginTop: 4 }}></div>{translate("task.task_process.finished")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}

function mapState(state) {
    const { user, auth, role } = state;
    return { user, auth, role };
}

const actionCreators = {
    getDepartment: UserActions.getDepartmentOfUser,
    getTaskById: performTaskAction.getTaskById,
    getAllUsersWithRole: UserActions.getAllUsersWithRole,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
};
const connectedViewProcess = connect(mapState, actionCreators)(withTranslate(ViewProcess));
export { connectedViewProcess as ViewProcess };
