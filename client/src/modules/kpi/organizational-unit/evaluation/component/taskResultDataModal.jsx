import React, { Component } from 'react';

class ModalDataResultTask extends Component {
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
            <div className="modal modal-full fade" id={"dataResultTask" + this.props.id} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog-full modal-tasktemplate">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">×</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <h3 className="modal-title" id="myModalLabel">Thông tin chi tiết mục tiêu đảm bảo quy trình nội bộ <small>KPI đơn vị</small></h3>
                        </div>
                        {/* Modal Body */}
                        <div className="modal-body modal-body-perform-task" >
                            <div className="model-item">
                                <h4>
                                    <b>Mục tiêu số 1: Hoàn thành quy định của công ty</b>
                                    <small>(30%, 4cv, 4 cvht)</small>
                                </h4>
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
                            <div className="model-item">
                                <h4>
                                    <b>Mục tiêu số 2: Đảm bảo chất lượng đầu ra của sản phẩm</b>
                                    <small>(30%, 4cv, 4 cvht)</small>
                                </h4>
                                <table className="table table-bordered">
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
                            <div className="modal-item">
                                <h4>
                                    <b>Mục tiêu số 2: Đảm bảo chất lượng đầu vao của nguyên liệu</b>
                                    <small>(30%, 4cv, 4 cvht)</small>
                                </h4>
                                <table className="table table-bordered">
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
                            <div className="modal-item">
                                <h4>
                                    <b>Mục tiêu số 4: Hợp tác với các phòng ban</b>
                                    <small>(30%, 4cv, 4 cvht)</small>
                                </h4>
                                <table className="table table-bordered">
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
                    </div>
                </div>
            </div>
        );
    }
}

export { ModalDataResultTask };