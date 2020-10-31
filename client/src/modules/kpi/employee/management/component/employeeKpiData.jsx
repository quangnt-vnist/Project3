import React, { Component } from 'react';

class KPIPersonalEvaluate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false
        };
    };
    handleEdit = () => {
        this.setState({
            editing: !this.state.editing
        })
    }
    handleSubmit = () => {
        this.setState({
            editing: !this.state.editing
        })
    }
    render() {
        const { editing } = this.state;
        return (
            <div className="table-wrapper box">
                {/* <div className="content-wrapper"> */}
                    {/* <section className="content-header">
                        <h1>
                            <b>Dữ liệu KPI cá nhân</b>
                        </h1>
                        <ol className="breadcrumb">
                            <li><a href="/"><i className="fa fa-dashboard" /> Home</a></li>
                            <li><a href="/">Forms</a></li>
                            <li className="active">Advanced Elements</li>
                        </ol>
                    </section> */}
                    <section className="content">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="box">
                                    <div className="box-header">
                                        <h3 className="box-title"><b>Bảng danh sách dữ liệu KPI cá nhân</b></h3>
                                    </div>
                                    <div className="box-body">
                                        <div className="model-item">
                                            <div className="header-item" style={{ border: "solid 1px #F8F8F8", background: "#F8F8F8" }}>
                                                <h4><a data-toggle="collapse" href="#mt1" aria-expanded="false" aria-controls="mt1">
                                                    Mục tiêu số 1: Hoàn thành quy định của công ty
                                                    <small>(30%, 4cv, 4 cvht)</small></a>
                                                </h4>
                                            </div>
                                            <div id="mt1" className="collapse">
                                                <table className="table table-bordered table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>Tên công việc</th>
                                                            <th>Vai trò</th>
                                                            <th>Thời gian</th>
                                                            <th>Trạng thái</th>
                                                            <th>Mức độ hoàn thành(%)</th>
                                                            <th>Hành động</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Công việc số 1</td>
                                                            <td>Người thực hiện</td>
                                                            <td>3/10-25/10</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>100</td>
                                                            <td>
                                                                <a href="#myModalHorizontal1" data-toggle="modal" className="view" title="View" data-target="#myModalHorizontal1"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Công việc số 2</td>
                                                            <td>Người thực hiện</td>
                                                            <td>2/10-15/10</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>100</td>
                                                            <td>
                                                                <a href="#myModalHorizontal2" data-toggle="modal" data-target="#myModalHorizontal2" className="view" title="View"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Công việc số 3</td>
                                                            <td>Người phê duyệt</td>
                                                            <td>29/10-30/10</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>100</td>
                                                            <td>
                                                                <a href="#myModalHorizontal3" data-toggle="modal" data-target="#myModalHorizontal3" className="view" title="View"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Công việc số 4</td>
                                                            <td>Người góp ý</td>
                                                            <td>29/10-30/10</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>100</td>
                                                            <td>
                                                                <a href="#myModalHorizontal4" data-toggle="modal" data-target="#myModalHorizontal4" className="view" title="View"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><b>Điểm tính tự động</b></td>
                                                            <td>{editing ? <input defaultValue="20" style={{ width: "100%" }}></input> : 20}</td>
                                                            <td><b>Tự đánh giá</b></td>
                                                            <td>{editing ? <input defaultValue="20" style={{ width: "100%" }}></input> : 20}</td>
                                                            <td><b>Quản lý đánh giá</b></td>
                                                            <td>{editing ? <input defaultValue="20" style={{ width: "100%" }}></input> : 20}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="model-item">
                                            <div className="header-item" style={{ border: "solid 1px #F8F8F8", background: "#F8F8F8" }}>
                                                <h4><a data-toggle="collapse" href="#mt2" aria-expanded="false" aria-controls="mt2">
                                                    Mục tiêu số 2: Đảm bảo chất lượng đầu ra của sản phẩm
                                                    <small>(30%, 4cv, 4 cvht)</small></a>
                                                </h4>
                                            </div>
                                            <div id="mt2" className="collapse">
                                                <table className="table table-bordered table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>Tên công việc</th>
                                                            <th>Vai trò</th>
                                                            <th>Thời gian</th>
                                                            <th>Trạng thái</th>
                                                            <th>Kết quả</th>
                                                            <th>Hành động</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Công việc số 1</td>
                                                            <td>Người thực hiện</td>
                                                            <td>3/10-25/10</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>80</td>
                                                            <td>
                                                                <a href="#myModalHorizontal1" data-toggle="modal" className="view" title="View" data-target="#myModalHorizontal1"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Công việc số 2</td>
                                                            <td>Người thực hiện</td>
                                                            <td>2/10-15/10</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>80</td>
                                                            <td>
                                                                <a href="#myModalHorizontal2" data-toggle="modal" data-target="#myModalHorizontal2" className="view" title="View"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Công việc số 3</td>
                                                            <td>Người phê duyệt</td>
                                                            <td>29/10-30/10</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>100</td>
                                                            <td>
                                                                <a href="#myModalHorizontal3" data-toggle="modal" data-target="#myModalHorizontal3" className="view" title="View"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Công việc số 4</td>
                                                            <td>Người góp ý</td>
                                                            <td>29/10-30/10</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>100</td>
                                                            <td>
                                                                <a href="#myModalHorizontal4" data-toggle="modal" data-target="#myModalHorizontal4" className="view" title="View"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><b>Điểm tính tự động</b></td>
                                                            <td>{editing ? <input defaultValue="20" style={{ width: "100%" }}></input> : 20}</td>
                                                            <td><b>Tự đánh giá</b></td>
                                                            <td>{editing ? <input defaultValue="25" style={{ width: "100%" }}></input> : 25}</td>
                                                            <td><b>Quản lý đánh giá</b></td>
                                                            <td>{editing ? <input defaultValue="25" style={{ width: "100%" }}></input> : 25}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="modal-item">
                                            <div className="header-item" style={{ border: "solid 1px #F8F8F8", background: "#F8F8F8" }}>
                                                <h4><a data-toggle="collapse" href="#mt3" aria-expanded="false" aria-controls="mt3">
                                                Mục tiêu số 3: Đảm bảo chất lượng đầu vao của nguyên liệu
                                                    <small>(30%, 4cv, 4 cvht)</small></a>
                                                </h4>
                                            </div>
                                            <div id="mt3" className="collapse">
                                                <table className="table table-bordered table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>Tên công việc</th>
                                                            <th>Vai trò</th>
                                                            <th>Thời gian</th>
                                                            <th>Trạng thái</th>
                                                            <th>Mức độ hoàn thành(%)</th>
                                                            <th>Hành động</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Công việc số 1</td>
                                                            <td>Người thực hiện</td>
                                                            <td>3/10-25/10</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>80</td>
                                                            <td>
                                                                <a href="#myModalHorizontal1" data-toggle="modal" className="view" title="View" data-target="#myModalHorizontal1"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Công việc số 2</td>
                                                            <td>Người thực hiện</td>
                                                            <td>2/10-15/10</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>80</td>
                                                            <td>
                                                                <a href="#myModalHorizontal2" data-toggle="modal" data-target="#myModalHorizontal2" className="view" title="View"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Công việc số 3</td>
                                                            <td>Người phê duyệt</td>
                                                            <td>29/10-30/10</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>100</td>
                                                            <td>
                                                                <a href="#myModalHorizontal3" data-toggle="modal" data-target="#myModalHorizontal3" className="view" title="View"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Công việc số 4</td>
                                                            <td>Người góp ý</td>
                                                            <td>29/10-30/10</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>100</td>
                                                            <td>
                                                                <a href="#myModalHorizontal4" data-toggle="modal" data-target="#myModalHorizontal4" className="view" title="View"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><b>Điểm tính tự động</b></td>
                                                            <td>{editing ? <input defaultValue="25" style={{ width: "100%" }}></input> : 25}</td>
                                                            <td><b>Tự đánh giá</b></td>
                                                            <td>{editing ? <input defaultValue="30" style={{ width: "100%" }}></input> : 30}</td>
                                                            <td><b>Quản lý đánh giá</b></td>
                                                            <td>{editing ? <input defaultValue="30" style={{ width: "100%" }}></input> : 30}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="modal-item">
                                            <div className="header-item" style={{ border: "solid 1px #F8F8F8", background: "#F8F8F8" }}>
                                                <h4><a data-toggle="collapse" href="#mt4" aria-expanded="false" aria-controls="mt4">
                                                    Mục tiêu số 4: Hợp tác với các phòng ban
                                                    <small>(30%, 4cv, 4 cvht)</small></a>
                                                </h4>
                                            </div>
                                            <div id="mt4" className="collapse">
                                                <table className="table table-bordered table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>Tên công việc</th>
                                                            <th>Vai trò</th>
                                                            <th>Thời gian</th>
                                                            <th>Trạng thái</th>
                                                            <th>Mức độ hoàn thành</th>
                                                            <th>Hành động</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Công việc số 1</td>
                                                            <td>Người thực hiện</td>
                                                            <td>3/10-25/10</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>90</td>
                                                            <td>
                                                                <a href="#myModalHorizontal1" data-toggle="modal" className="view" title="View" data-target="#myModalHorizontal1"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Công việc số 2</td>
                                                            <td>Người thực hiện</td>
                                                            <td>2/10-15/10</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>100</td>
                                                            <td>
                                                                <a href="#myModalHorizontal2" data-toggle="modal" data-target="#myModalHorizontal2" className="view" title="View"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Công việc số 3</td>
                                                            <td>Người phê duyệt</td>
                                                            <td>29/10-30/10</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>100</td>
                                                            <td>
                                                                <a href="#myModalHorizontal3" data-toggle="modal" data-target="#myModalHorizontal3" className="view" title="View"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Công việc số 4</td>
                                                            <td>Người góp ý</td>
                                                            <td>29/10-30/10</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>100</td>
                                                            <td>
                                                                <a href="#myModalHorizontal4" data-toggle="modal" data-target="#myModalHorizontal4" className="view" title="View"><i className="material-icons">visibility</i></a>
                                                                <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><b>Điểm tính tự động</b></td>
                                                            <td>{editing ? <input defaultValue="15" style={{ width: "100%" }}></input> : 15}</td>
                                                            <td><b>Tự đánh giá</b></td>
                                                            <td>{editing ? <input defaultValue="15" style={{ width: "100%" }}></input> : 15}</td>
                                                            <td><b>Quản lý đánh giá</b></td>
                                                            <td>{editing ? <input defaultValue="20" style={{ width: "100%" }}></input> : 20}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            {editing ? <button type="button" className="btn btn-success" data-dismiss="modal" onClick={this.handleSubmit}>Save</button>
                                                : <button type="button" className="btn btn-success" onClick={this.handleEdit}>Edit</button>}
                                            <button type="button" className="btn btn-primary" data-dismiss="modal">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                {/* </div> */}
            </div>
        );
    }
}

export { KPIPersonalEvaluate };