import React, { Component } from 'react';
import { connect } from 'react-redux';
import { managerServices } from '../../../organizational-unit/management/redux/services';


class ModalDetailEmployeeKpiSet extends Component {
    // componentDidMount() {
    //     this.props.getAllTarget(this.state.unit);
    // }

    constructor(props) {
        super(props);
        this.state = {
            organizationalUnit: '5dcadf02f0343012f09c1193',
            content: ""
        };
    }
    componentDidUpdate() {
        this.handleResizeColumn();
    }
    handleResizeColumn = () => {
        window.$(function () {
            var pressed = false;
            var start = undefined;
            var startX, startWidth;

            window.$("table thead tr th").mousedown(function (e) {
                start = window.$(this);
                pressed = true;
                startX = e.pageX;
                startWidth = window.$(this).width();
                window.$(start).addClass("resizing");
            });

            window.$(document).mousemove(function (e) {
                if (pressed) {
                    window.$(start).width(startWidth + (e.pageX - startX));
                }
            });

            window.$(document).mouseup(function () {
                if (pressed) {
                    window.$(start).removeClass("resizing");
                    pressed = false;
                }
            });
        });
    }
    handleChangeContent = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                content: id
            }
        })
    }
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }
    render() {
        var list;
        const { employeeKpiSet } = this.props;
        if (employeeKpiSet.kpis) list = employeeKpiSet.kpis;
        return (
            <div className="modal modal-full fade" id={"detailKPIPersonal" + employeeKpiSet._id} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog-full modal-tasktemplate">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header" style={{ textAlign: "center", background: "#605ca8", color: "white" }}>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">×</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <h3 className="modal-title" id="myModalLabel">Thông tin chi tiết kpi cá nhân tháng {this.formatDate(employeeKpiSet.time)}</h3>
                        </div>
                        {/* Modal Body */}
                        <div className="modal-body modal-body-perform-task" >
                            <div className="left-modal">
                                <div className="header-left-modal" style={{ fontWeight: "500", background: "slateblue", color: "white" }}>
                                    <h4>Danh sách mục tiêu</h4>
                                </div>
                                <div className="content-left-modal" id="style-1" style={{ width: "24.5%" }}>
                                    <div className="scroll-content" style={{ borderRight: "3px solid #ddd" }}>
                                        {list && list.map((item, index) =>
                                            <a href="#abc" onClick={() => this.handleChangeContent(item._id)} className="list-group-item" key={index}>
                                                {item.name}
                                                <span className="badge">{15 + index}</span>
                                            </a>)}
                                    </div>
                                </div>
                            </div>
                            <div className="right-modal">
                                {
                                    list && list.map(item => {
                                        if (item._id === this.state.content) return <React.Fragment key={item._id}>
                                            <div className="header-content-right">
                                                <div className="col-sm-12" style={{ fontWeight: "500" }}>
                                                    <h4>Thông tin mục tiêu</h4>
                                                </div>
                                                <div className="col-sm-12">
                                                    <label className="col-sm-2" style={{ fontWeight: "400" }}>Tiêu chí đính giá:</label>
                                                    <label className="col-sm-10" style={{ fontWeight: "400" }}>{item.name}</label>
                                                </div>
                                                <div className="col-sm-12">
                                                    <label className="col-sm-2" style={{ fontWeight: "400" }}>Điểm tối đa:</label>
                                                    <label className="col-sm-10" style={{ fontWeight: "400" }}>{item.weight}</label>
                                                </div>
                                                <div className="col-sm-12">
                                                    <label className="col-sm-2" style={{ fontWeight: "400" }}>Hệ thống đánh giá:</label>
                                                    <label className="col-sm-10" style={{ fontWeight: "400" }}>{item.systempoint == null ? "Chưa đánh giá" : item.systempoint}</label>
                                                </div>
                                                <div className="col-sm-12">
                                                    <label className="col-sm-2" style={{ fontWeight: "400" }}>Quản lý đánh giá:</label>
                                                    <label className="col-sm-10" style={{ fontWeight: "400" }}>{item.approverpoint === null ? "Chưa đánh giá" : item.approverpoint}</label>
                                                </div>
                                                <div className="col-sm-12">
                                                    <label className="col-sm-2" style={{ fontWeight: "400" }}>Cá nhân tự đánh giá:</label>
                                                    {
                                                        employeeKpiSet.status !== 3 ?
                                                            <React.Fragment>
                                                                <input type="number" min="0" max={item.weight} className="col-sm-4" defaultValue="0" name="value" />
                                                                <button className="col-sm-2 col-sm-offset-4 btn btn-success">Lưu</button>
                                                            </React.Fragment>
                                                            : <label className="col-sm-10" style={{ fontWeight: "400" }}>{item.mypoint}</label>
                                                    }
                                                </div>
                                            </div>
                                            <div className="body-content-right">
                                                <div className="col-sm-12" style={{ fontWeight: "500" }}>
                                                    <h4>Danh sách các công việc</h4>
                                                </div>
                                                <table id="example1" className="table table-bordered table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: "20px" }}>Stt</th>
                                                            <th>Tên công việc</th>
                                                            <th>Đơn vị</th>
                                                            <th>Mô tả công việc</th>
                                                            <th>Người tạo</th>
                                                            <th>Người phê duyệt</th>
                                                            <th>Người tư vấn</th>
                                                            <th>Trạng thái</th>
                                                            <th>Kết quả đánh giá</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>1</td>
                                                            <td>Kiểm thử lô hàng số 17</td>
                                                            <td>Đảm bảo chất lượng sản phẩm</td>
                                                            <td>Hoàn thành kiểm thử chất lượng, thành phần của sản phẩm</td>
                                                            <td>Lê Thị Phương</td>
                                                            <td>Lê Việt Anh</td>
                                                            <td>Hoàng Thị Hạnh</td>
                                                            <td>Đang thực hiện</td>
                                                            <td>0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>2</td>
                                                            <td>Kiểm thử lô hàng số 13</td>
                                                            <td>Đảm bảo chất lượng sản phẩm</td>
                                                            <td>Hoàn thành kiểm thử chất lượng, thành phần của sản phẩm</td>
                                                            <td>Lê Thị Phương</td>
                                                            <td>Lê Việt Anh</td>
                                                            <td>Hoàng Thị Hạnh</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>95</td>
                                                        </tr>
                                                        <tr>
                                                            <td>3</td>
                                                            <td>Kiểm thử lô hàng số 15</td>
                                                            <td>Đảm bảo chất lượng sản phẩm</td>
                                                            <td>Hoàn thành kiểm thử chất lượng, thành phần của sản phẩm</td>
                                                            <td>Lê Thị Phương</td>
                                                            <td>Lê Việt Anh</td>
                                                            <td>Hoàng Thị Hạnh</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>90</td>
                                                        </tr>
                                                        <tr>
                                                            <td>4</td>
                                                            <td>Kiểm thử lô hàng số 19</td>
                                                            <td>Đảm bảo chất lượng sản phẩm</td>
                                                            <td>Hoàn thành kiểm thử chất lượng, thành phần của sản phẩm</td>
                                                            <td>Lê Thị Phương</td>
                                                            <td>Lê Việt Anh</td>
                                                            <td>Hoàng Thị Hạnh</td>
                                                            <td>Đang thực hiện</td>
                                                            <td>0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>5</td>
                                                            <td>Kiểm thử lô hàng số 11</td>
                                                            <td>Đảm bảo chất lượng sản phẩm</td>
                                                            <td>Hoàn thành kiểm thử chất lượng, thành phần của sản phẩm</td>
                                                            <td>Lê Thị Phương</td>
                                                            <td>Lê Việt Anh</td>
                                                            <td>Hoàng Thị Hạnh</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>85</td>
                                                        </tr>
                                                        <tr>
                                                            <td>6</td>
                                                            <td>Kiểm thử lô hàng số 10</td>
                                                            <td>Đảm bảo chất lượng sản phẩm</td>
                                                            <td>Hoàn thành kiểm thử chất lượng, thành phần của sản phẩm</td>
                                                            <td>Lê Thị Phương</td>
                                                            <td>Lê Việt Anh</td>
                                                            <td>Hoàng Thị Hạnh</td>
                                                            <td>Đang thực hiện</td>
                                                            <td>0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>7</td>
                                                            <td>Kiểm thử lô hàng số 1</td>
                                                            <td>Đảm bảo chất lượng sản phẩm</td>
                                                            <td>Hoàn thành kiểm thử chất lượng, thành phần của sản phẩm</td>
                                                            <td>Lê Thị Phương</td>
                                                            <td>Lê Việt Anh</td>
                                                            <td>Hoàng Thị Hạnh</td>
                                                            <td>Đã hoàn thành</td>
                                                            <td>80</td>
                                                        </tr>
                                                        <tr>
                                                            <td>8</td>
                                                            <td>Kiểm thử lô hàng số 8</td>
                                                            <td>Đảm bảo chất lượng sản phẩm</td>
                                                            <td>Hoàn thành kiểm thử chất lượng, thành phần của sản phẩm</td>
                                                            <td>Lê Thị Phương</td>
                                                            <td>Lê Việt Anh</td>
                                                            <td>Hoàng Thị Hạnh</td>
                                                            <td>Đã hủy</td>
                                                            <td>0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>9</td>
                                                            <td>Kiểm thử lô hàng số 7</td>
                                                            <td>Đảm bảo chất lượng sản phẩm</td>
                                                            <td>Hoàn thành kiểm thử chất lượng, thành phần của sản phẩm</td>
                                                            <td>Lê Thị Phương</td>
                                                            <td>Lê Việt Anh</td>
                                                            <td>Hoàng Thị Hạnh</td>
                                                            <td>Đang thực hiện</td>
                                                            <td>0</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div className="footer-content-right">
                                                    <button style={{ float: "right" }}>Xuất file</button>
                                                </div>
                                            </div>
                                        </React.Fragment>;
                                        return true;
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { managerKpiUnit } = state;
    return { managerKpiUnit };
}

const actionCreators = {
    getAllTarget: managerServices.getAllTargetByUnitId,
};
const connectedModalDetailEmployeeKpiSet = connect(mapState, actionCreators)(ModalDetailEmployeeKpiSet);
export { connectedModalDetailEmployeeKpiSet as ModalDetailEmployeeKpiSet };
