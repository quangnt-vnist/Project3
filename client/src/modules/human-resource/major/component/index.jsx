import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Tree, SlimScroll, ExportExcel } from '../../../../common-components';
import Swal from 'sweetalert2';
import { MajorActions } from '../redux/actions';
import EditForm from './editForm';
import CreateForm from './createForm';
import "./major.css";

class Major extends Component {
    constructor(props) {
        super(props);
        this.state = {
            majorParent: [],
            deleteNode: [],
        }
    }

    componentDidMount() {
        this.props.getListMajor({ name: '', page: 1, limit: 1000 });
    }
    onChanged = async (e, data) => {
        await this.setState({
            currentNode: data.node,
        })
        window.$(`#edit-major`).slideDown();
    }

    checkNode = (e, data) => {
        this.setState({
            majorParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d]
        })
    }

    unCheckNode = (e, data) => {
        this.setState({
            majorParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d],

        })
    }
    handleAddMajor = (event) => {
        event.preventDefault();
        window.$('#modal-create-major').modal('show');
    }
    /**Mở modal import file excel */
    handImportFile = (event) => {
        event.preventDefault();
        window.$('#modal_import_file_archive').modal('show');
    }
    deleteMajor = () => {
        const { translate } = this.props;
        const { deleteNode, majorParent } = this.state;
        Swal.fire({
            html: `<h4 style="color: red"><div>Xóa lưu trữ</div>?</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then(result => {
            console.log('Confirm delete');
            if (result.value && majorParent.length > 1) {
                // this.props.deleteDocumentArchive(majorParent, "many");
                // this.setState({
                //     deleteNode: []
                // });
            } else if (result.value && majorParent.length === 1) {
                // this.props.deleteDocumentArchive(majorParent, 'single');
                // this.setState({
                //     deleteNode: []
                // });
            }
        })
    }

    findChildrenNode = (list, node) => {
        let array = [];
        let queue_children = [];
        queue_children = [node];
        while (queue_children.length > 0) {
            let tmp = queue_children.shift();
            array = [...array, tmp._id];
            let children = list.filter(child => child.parent === tmp.id);
            queue_children = queue_children.concat(children);
        }
        array.shift();
        array.unshift(node.id);
        return array;
    }

    render() {
        const { majorParent, currentNode } = this.state;
        const { translate } = this.props;
        const { major } = this.props;
        const list = major.listMajor;

        let dataTree = list.map(elm => {
            return {
                ...elm,
                id: elm._id,
                text: elm.name,
                state: { "opened": true },
                parent: "#",
            }
        });
        for (let i in list) {
            let groupMap = list[i].group;
            let group = list[i].group.map(elm => {
                return {
                    ...elm,
                    id: elm._id,
                    text: elm.name,
                    state: { "opened": true },
                    parent: list[i]._id.toString(),
                }
            });
            dataTree = [...dataTree, ...group];
            for (let x in groupMap) {
                let specializedMap = groupMap[x].specialized;
                let specialized = groupMap[x].specialized.map(elm => {
                    return {
                        ...elm,
                        id: elm._id,
                        text: elm.name,
                        state: { "opened": true },
                        parent: groupMap[x]._id.toString(),
                    }
                });
                dataTree = [...dataTree, ...specialized];
            }
        }
        let unChooseNode = currentNode ? this.findChildrenNode(list, currentNode) : [];
        console.log('dataTree', dataTree);
        return (
            <React.Fragment>
                <div className="box box-body">

                    <div className="form-inline">
                        {/* <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                            <button type="button" className="btn btn-success dropdown-toggler pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('document.administration.domains.add')}>{translate('general.add')}</button>
                            <ul className="dropdown-menu pull-right">
                                <li><a href="#modal-create-major" title="Add archive" onClick={(event) => { this.handleAddMajor(event) }}>{translate('document.add')}</a></li>
                                <li><a href="#modal_import_file_archive" title="ImportForm" onClick={(event) => { this.handImportFile(event) }}>{translate('document.import')}</a></li>
                            </ul>
                        </div> */}
                        <a className="btn btn-success pull-right" href="#modal-create-major" title="Add major" onClick={(event) => { this.handleAddMajor(event) }}>Thêm</a>
                    </div>

                    {
                        majorParent.length > 0 && <button className="btn btn-danger" style={{ marginLeft: '5px' }} onClick={this.deleteMajor}>{translate('general.delete')}</button>
                    }
                    {/* <ExportExcel id="export-major" exportData={exportData} style={{ marginRight: 5 }} buttonName={translate('document.export')} /> */}
                    <CreateForm list={dataTree}/>
                    {/* <ArchiveImportForm /> */}
                    <div className="row"
                    >
                        <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                            <div className="major-tree" id="major-tree">
                                <Tree
                                    id="tree-qlcv-major"
                                    onChanged={this.onChanged}
                                    checkNode={this.checkNode}
                                    unCheckNode={this.unCheckNode}
                                    data={dataTree}
                                />
                            </div>
                            <SlimScroll outerComponentId="major-tree" innerComponentId="tree-qlcv-major" innerComponentWidth={"100%"} activate={true} />
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                            {
                                currentNode &&
                                <EditForm
                                    majorId={currentNode.id}
                                    majorName={currentNode.text}
                                    majorCode={currentNode.original.code}
                                    majorParent={currentNode.parent}

                                    listData={dataTree}
                                    unChooseNode={unChooseNode}
                                />
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getListMajor: MajorActions.getListMajor,
    // editDocumentArchive: MajorActions.editDocumentArchive,
    // deleteDocumentArchive: MajorActions.deleteDocumentArchive,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Major));