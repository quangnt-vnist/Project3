import React, { Component } from 'react';
import { connect } from 'react-redux';
import { evaluateActions } from '../redux/actions';
// import { kpiUnitActions } from '../../../../redux-actions/CombineActions';
import { ModalDataResultTask } from './taskResultDataModal';

class KPIUnitEvaluate extends Component {
    componentDidMount() {
        // get all target of unit
        this.props.getAllTarget(this.state.unit);
    }

    constructor(props) {
        super(props);
        this.state = {
            unit: '5db7e5820ab82817c09b4605'
        };
    }
    render() {
        var list;
        const { evaluate } = this.props;
        if (evaluate.items) list = evaluate.items;
        return (
            <div className="table-wrapper box">
                {/* <div className="content-wrapper"> */}
                    {/* <section className="content-header">
                        <h1>
                            <b>Chi tiết kpi tháng 11</b>
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
                                    {/* <div className="box-header">
                                        <h3 className="box-title"><b>Dữ liệu KPI ban giám đốc</b></h3>
                                    </div> */}
                                    {list &&
                                        <div className="box-header">
                                            <div className="form-group">
                                                <label className="col-sm-2">- Số mục tiêu</label>
                                                <label className="col-sm-10">: {list.reduce(sum => sum + 1, 0)}</label>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-sm-2"><b>- Tổng trọng số</b></label>
                                                <label className="col-sm-10">: {list.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0)}</label>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-sm-2"><b>- Ghi chú</b></label>
                                                <label className="col-sm-10">: {list.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0) !== 100 ? " Trọng số chưa thỏa mãn" : " Trọng số đã thỏa mãn"}</label>
                                            </div>
                                        </div>
                                    }
                                    <div className="box-body">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "40px" }}>Stt</th>
                                                    <th>Tên mục tiêu</th>
                                                    <th>Tiêu chí đánh giá</th>
                                                    <th>Thời gian</th>
                                                    <th style={{ width: "80px" }}>Trọng số</th>
                                                    <th>Trạng thái</th>
                                                    <th>Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    (typeof list === 'undefined' || list.length === 0) ? <tr><td colSpan={7}>No data</td></tr> :
                                                        list.map((item, index) =>
                                                            <tr key={item._id}>
                                                                <td>{index + 1}</td>
                                                                <td>{item.name}</td>
                                                                <td>{item.criteria}</td>
                                                                <td>{item.time}</td>
                                                                <td>{item.weight}</td>
                                                                <td>{item.confirm ? "Đã kích hoạt" : "Chưa kích hoạt"}</td>
                                                                <td>
                                                                    <center><a href={`#dataResultTask${index+1}`} title="Xem chi tiết" data-toggle="modal"><i className="material-icons">view_list</i></a></center>
                                                                    <ModalDataResultTask id={index+1}/>
                                                                </td>
                                                            </tr>
                                                        )
                                                }
                                            </tbody>
                                        </table>
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

function mapState(state) {
    const { evaluate } = state;
    return { evaluate };
}

const actionCreators = {
    getAllTarget: evaluateActions.getAllTargetByUnitId,
};
const connectedKPIUnitEvaluate = connect(mapState, actionCreators)(KPIUnitEvaluate);
export { connectedKPIUnitEvaluate as KPIUnitEvaluate };