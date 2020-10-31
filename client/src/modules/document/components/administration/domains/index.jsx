import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DocumentActions } from '../../../redux/actions';
import { Tree, SlimScroll, ExportExcel } from '../../../../../common-components';

import CreateForm from './createForm';
import EditForm from './editForm';
import { DomainImportForm } from './domainImportForm';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import './domains.css'
class AdministrationDocumentDomains extends Component {
    constructor(props) {
        super(props);
        this.state = {
            domainParent: [],
            deleteNode: [],
        }
    }

    componentDidMount() {
        //this.props.getDocumentDomains();
    }

    onChanged = (e, data) => {
        this.setState({ currentDomain: data.node }, () => {
            window.$(`#edit-document-domain`).slideDown();
        });
    }

    checkNode = (e, data) => { //chọn xóa một node và tất cả các node con của nó
        this.setState({
            domainParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d]
        })
    }

    unCheckNode = (e, data) => {
        this.setState({
            domainParent: [...data.selected],
            deleteNode: [...data.selected]
        })
    }

    deleteDomains = () => {
        const { translate } = this.props;
        const { deleteNode } = this.state;
        Swal.fire({
            html: `<h4 style="color: red"><div>${translate('document.administration.domains.delete')}</div>?</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then((result) => {
            if (result.value && deleteNode.length > 0) {
                this.props.deleteDocumentDomain(deleteNode, "many");
                this.setState({
                    deleteNode: []
                });
            }
        })
    }
    /**Mở modal import file excel */
    handImportFile = (event) => {
        event.preventDefault();
        window.$('#modal_import_file-domain').modal('show');
    }
    handleAddDomain = (event) => {
        event.preventDefault();
        window.$('#modal-create-document-domain').modal('show');
    }
    convertDataToExportData = (data) => {
        data = data ? data.map((x, index) => {
            return {
                STT: index + 1,
                name: x.name,
                description: x.description,
            }
        }) : "";
        let exportData = {
            fileName: "Bảng thống kê danh mục",
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    tables: [
                        {
                            tableName: "Bảng thống kê danh mục",
                            rowHeader: 1,
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "name", value: "Tên danh mục" },
                                { key: "description", value: "Mô tả danh mục" },
                            ],
                            data: data
                        },
                    ]
                },
            ]
        }
        return exportData;
    }
    // tìm các node con cháu
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
        const { domainParent, deleteNode, currentDomain } = this.state;
        const { translate } = this.props;
        const { list } = this.props.documents.administration.domains;
        const { documents } = this.props;
        const dataTree = list ? list.map(node => {
            return {
                ...node,
                text: node.name,
                state: { "opened": true },
                parent: node.parent ? node.parent.toString() : "#"
            }
        }) : null
        let dataExport = [];
        if (documents.isLoading === false) {
            dataExport = list;
        }
        let exportData = this.convertDataToExportData(dataExport);
        let unChooseNode = currentDomain ? this.findChildrenNode(list, currentDomain) : [];
        return (
            <React.Fragment>
                <div className="form-inline">
                    <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                        <button type="button" className="btn btn-success dropdown-toggler pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('document.administration.domains.add')}>{translate('general.add')}</button>
                        <ul className="dropdown-menu pull-right">
                            <li><a href="#form-create-document-domain" title="ImportForm" onClick={(event) => { this.handleAddDomain(event) }}>{translate('task_template.add')}</a></li>
                            <li><a href="#modal_import_file-domain" title="ImportForm" onClick={(event) => { this.handImportFile(event) }}>{translate('document.import')}</a></li>
                        </ul>
                    </div>
                </div>
                {
                    deleteNode.length > 0 && <button className="btn btn-danger" style={{ marginLeft: '5px' }} onClick={this.deleteDomains}>{translate('general.delete')}</button>
                }
                <ExportExcel id="export-document-domain" exportData={exportData} style={{ marginRight: 5 }} buttonName={translate('document.export')} />
                <CreateForm/>
                <DomainImportForm />
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                        <div className="domain-tree" id="domain-tree">
                            <Tree
                                id="tree-qlcv-document"
                                onChanged={this.onChanged}
                                checkNode={this.checkNode}
                                unCheckNode={this.unCheckNode}
                                data={dataTree}
                            />
                        </div>
                        <SlimScroll outerComponentId="domain-tree" innerComponentId="tree-qlcv-document" innerComponentWidth={"100%"} activate={true} />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                        {
                            this.state.currentDomain &&
                            <EditForm
                                domainId={this.state.currentDomain.id}
                                domainName={this.state.currentDomain.text}
                                domainDescription={this.state.currentDomain.original.description ? this.state.currentDomain.original.description : ""}
                                domainParent={this.state.currentDomain.parent}
                                unChooseNode={unChooseNode}
                            />
                        }
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getDocumentDomains: DocumentActions.getDocumentDomains,
    editDocumentDomain: DocumentActions.editDocumentDomain,
    deleteDocumentDomain: DocumentActions.deleteDocumentDomain,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(AdministrationDocumentDomains));