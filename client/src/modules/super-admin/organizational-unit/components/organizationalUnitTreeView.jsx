import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import './organizationalUnit.css';

import { DeleteNotification, ExportExcel } from '../../../../common-components';

import { DepartmentActions } from '../redux/actions';

import DepartmentCreateForm from './organizationalUnitCreateForm';
import DepartmentEditForm from './organizationalUnitEditForm';
import DepartmentCreateWithParent from './organizationalUnitCreateWithParent';
import { DepartmentImportForm } from './organizationalUnitImportForm';


class DepartmentTreeView extends Component {
    constructor(props) {
        super(props);

        this.departmentId = React.createRef();

        this.state = {
            zoom: 13,
        }
    }

     // Cac ham xu ly du lieu voi modal
     convertDataToExportData = (data) => {
        // chuyen du lieu cay ve du lieu bang
        let listData = [];
        if (data) {
            for (let i = 0; i < data.length; i++) {
                listData = [...listData, data[i]];
                if (data[i].children){
                    let da = data[i].children;
                    for ( let j in da){
                        da[j]["parentName"] = data[i].name;
                        listData = [...listData, da[j]];
                        if (da[j].children){
                            let datas = da[j].children;
                            for ( let k in datas) {
                                datas[k]["parentName"] = da[j].name;
                                listData = [...listData, datas[k]];
                            }
                        }
                    }
                }
                
            }
        }
        let datas= [];
        if (listData.length !== 0){
            for (let k = 0; k < listData.length; k++) {
                let x = listData[k];
                let length = 1;
                let name = x.name;
                let description = x.description;
                let deans = x.deans.map( item => item.name);
                console.log(deans);
                if (deans.length > length) {
                    length = deans.length;
                }
                let viceDeans = x.viceDeans.map( item => item.name);
                if (viceDeans.length > length) {
                    length = viceDeans.length;
                }
                let employees = x.employees.map( item => item.name);
                if (employees.length > length) {
                    length = employees.length;
                }
                let parent = "";
                if (x.parentName){
                    parent = x.parentName;
                }
                let out =  {
                    STT: k + 1,
                    name: name,
                    description: description,
                    parent: parent,
                    deans: deans[0],
                    viceDeans: viceDeans[0],
                    employees: employees[0]
                };
                datas = [...datas, out];
                if (length > 1) {
                    for (let i = 1; i < length; i++) {
                        out = {
                            STT: "",
                            name: "",
                            description: "",
                            parent: "",
                            deans: deans[i],
                            viceDeans: viceDeans[i],
                            employees: employees[i]
                        };
                        datas = [...datas, out];
                    }
                }
            }
        }
        let exportData = {
            fileName: "Bảng thống kê cơ cấu tổ chức",
            dataSheets: [
                {
                    sheetTitle: "Bảng thống kê cơ cấu tổ chức",
                    sheetName: "sheet1",
                    tables: [{
                        rowHeader: 1,
                        columns: [
                            { key: "STT", value: "STT" },
                            { key: "name", value: "Tên đơn vị" },
                            { key: "description", value: "Mô tả đơn vị" },
                            { key: "parent", value: "Đơn vị cha"},
                            { key: "deans", value: "Tên các chức danh trưởng đơn vị" },
                            { key: "viceDeans", value: "Tên các chức danh phó đơn vị"},
                            { key: "employees", value: "Tên các chức danh nhân viên đơn vị"}
                        ],
                        data: datas
                    }]
                },
            ]
        }
        return exportData
    }

    handleCreate = (event) => {
        event.preventDefault();
        window.$('#modal-create-department').modal('show');
    }

    handImportFile = (event) => {
        event.preventDefault();
        window.$('#modal_import_file').modal('show');
    }

    handleEdit = (department) => {
        this.setState({
            currentRow: department
        }, () => window.$('#modal-edit-department').modal('show'));
    }

    handleCreateWithParent = (department) => {
        this.setState({
            currentRow: department
        }, () => window.$('#modal-create-department-with-parent').modal('show'));
    }

    toggleSetting = (id) => {
        if (document.getElementById(id).style.display === 'none') {
            document.getElementById(id).style.display = 'block';
        } else {
            document.getElementById(id).style.display = 'none';
        }
    }

    zoomIn = () => {
        if (this.state.zoom < 72) {
            this.setState({ zoom: this.state.zoom + 1 });
        }
    }

    zoomOut = () => {
        if (this.state.zoom > 0) {
            this.setState({ zoom: this.state.zoom - 1 });
        }
    }

    showNodeContent = (data, translate) => {
        return (
            <div className="tf-nc bg bg-primary" style={{
                    minWidth: '120px',
                    border: 'none',
                    padding: '0px', 
                    textAlign: 'center', 
                    fontWeight: '900', 
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
                }}>
                <div style={{padding: '8px'}}>
                    <span id={`department-${data.id}`} title={data.name} className="pull-right" style={{paddingLeft: '5px'}}>
                        <a href="#abc" style={{color: 'white'}} title="Ẩn/hiện điều khiển" onClick={() => this.toggleSetting(`department-setting-${data.id}`)}><i className="fa fa-gears"></i></a>
                    </span>
                    {`${data.name}`}
                </div>
                
                <div style={{backgroundColor: '#fff', paddingTop: '2px', display: 'none', borderTop: '0.5px solid #c1c1c1'}} id={`department-setting-${data.id}`}>
                    <a href="#setting-organizationalUnit" className="edit text-green" onClick={() => this.handleCreateWithParent(data)} title={translate('manage_department.add_title')}><i className="material-icons">library_add</i></a>
                    <a href="#setting-organizationalUnit" className="edit text-yellow" onClick={() => this.handleEdit(data)} title={translate('manage_department.edit_title')}><i className="material-icons">ballot</i></a>
                    <DeleteNotification
                        content={translate('manage_department.delete')}
                        data={{
                            id: data.id,
                            info: data.name
                        }}
                        func={this.props.destroy}
                    />
                </div>
            </div>
        )
    }

    displayTreeView = (data, translate) => {
        if (data) {
            if (!data.children) {
                return (
                    <li key={data.id}>
                        {this.showNodeContent(data, translate)}
                    </li>
                )
            }

            return (
                <li key={data.id}>
                    {this.showNodeContent(data, translate)}
                    <ul>
                        {
                            data.children.map(tag => this.displayTreeView(tag, translate))
                        }
                    </ul>
                </li>
            )
        } else {
            return null
        }
    }

    render() {
        const { translate, department } = this.props;
        const { tree } = this.props.department;
        const { currentRow } = this.state;
        let data = [];
        if (tree){
            data = tree;
        }
        
        let exportData = this.convertDataToExportData(data);

        return (
            <React.Fragment>
                {<ExportExcel id="export-organizationalUnit" exportData={exportData} style={{ marginLeft: 5 }}/>}
                {/* Button thêm mới một phòng ban */}
                <DepartmentCreateForm />
                <DepartmentImportForm />
                <div className="form-inline">
                    <div className="dropdown pull-right" >
                        <button type="button" className="btn btn-success dropdown-toggler pull-right" data-toggle="dropdown" aria-expanded="true" title='Thêm'>{translate('manage_department.add_title')}</button>
                        <ul className="dropdown-menu pull-right">
                            <li><a href="#modal-create-department" title={translate('manage_department.add_title')} onClick={(event) => { this.handleCreate(event) }}>{translate('manage_department.add_title')}</a></li>
                            <li><a href="#modal_import_file" title="ImportForm" onClick={(event) => { this.handImportFile(event) }}>ImportFile</a></li>
                        </ul>
                    </div>
                </div>

                {/* Kiểm tra có dữ liệu về các đơn vị, phòng ban hay không */}
                {
                    department.list && department.list.length > 0 ?
                        <React.Fragment >
                            <div className="pull-left">
                                <i className="btn btn-sm btn-default fa fa-plus" onClick={this.zoomIn} title={translate('manage_department.zoom_in')}></i>
                                <i className="btn btn-sm btn-default fa fa-minus" onClick={this.zoomOut} title={translate('manage_department.zoom_out')}></i>
                            </div>
                        </React.Fragment>
                        : department.isLoading ?
                            <p className="text-center">{translate('confirm.loading')}</p> :
                            <p className="text-center">{translate('confirm.no_data')}</p>
                }

                {/* Hiển thị cơ cấu tổ chức của công ty */}
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        {
                            tree &&
                            tree.map((tree, index) =>
                                <div key={index} className="tf-tree example" style={{ textAlign: 'left', fontSize: this.state.zoom, marginTop: '50px' }}>
                                    <ul>
                                        {
                                            this.displayTreeView(tree, translate)
                                        }
                                    </ul>
                                </div>
                            )
                        }
                    </div>
                </div>

                {/* Các form edit và thêm mới một phòng ban mới với phòng ban cha được chọn */}
                {
                    currentRow &&
                    <React.Fragment>
                        <DepartmentCreateWithParent
                            departmentId={currentRow.id}
                            departmentParent={currentRow.id}
                        />
                        <DepartmentEditForm
                            departmentId={currentRow.id}
                            departmentName={currentRow.name}
                            departmentDescription={currentRow.description}
                            departmentParent={currentRow.parent_id}
                            deans={currentRow.deans}
                            viceDeans={currentRow.viceDeans}
                            employees={currentRow.employees}
                        />
                    </React.Fragment>
                }
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { department } = state;
    return { department };
}

const getState = {
    destroy: DepartmentActions.destroy
}

export default connect(mapState, getState)(withTranslate(DepartmentTreeView)); 