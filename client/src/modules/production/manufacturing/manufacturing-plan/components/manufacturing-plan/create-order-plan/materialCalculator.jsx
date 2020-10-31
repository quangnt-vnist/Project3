import React, { Component } from 'react';
import PurchasingRequestCreateForm from '../../../../purchasing-request/components/purchasingRequestCreateForm';

class MaterialCalculator extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handleShowCreatePuschasingRequest() {

    }
    render() {
        const { id, manufacturingOrder } = this.props;
        let goods = manufacturingOrder.goods;
        return (
            <div id={id} className="tab-pane active">
                <table id="manufacturing-material-bom-table" className="table table-bordered">
                    <thead>
                        <tr>
                            <th rowSpan={2}>STT</th>
                            <th rowSpan={2}>Mã mặt hàng</th>
                            <th rowSpan={2}>Tên mặt hàng</th>
                            <th rowSpan={2}>Đơn vị tính</th>
                            <th rowSpan={2}>Quy tắc đóng gói</th>
                            <th rowSpan={2}>Cần sản xuất</th>
                            <th colSpan={7}>Định mức nguyên vật liệu</th>
                        </tr>
                        <tr>
                            <th>STT</th>
                            <th>Mã NVL</th>
                            <th>Tên NVL</th>
                            <th>Đơn vị tính</th>
                            <th>Số lượng</th>
                            <th>Tổng số lượng</th>
                            <th>Tồn kho</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(goods && goods.length !== 0) &&
                            goods.map((good, index) =>
                                good.good.materials.map((material, i) => (
                                    i === 0 ?
                                        <tr key={index}>
                                            <td rowSpan={good.good.materials.length}>{index + 1}</td>
                                            <td rowSpan={good.good.materials.length}>{good.good.code}</td>
                                            <td rowSpan={good.good.materials.length}>{good.good.name}</td>
                                            <td rowSpan={good.good.materials.length}>{good.good.baseUnit}</td>
                                            <td rowSpan={good.good.materials.length}>{good.good.packingRule}</td>
                                            <td rowSpan={good.good.materials.length}>{good.quantity - good.planedQuantity}</td>
                                            <td>{i + 1}</td>
                                            <td>{material.code}</td>
                                            <td>{material.name}</td>
                                            <td>{material.baseUnit}</td>
                                            <td>{material.quantity}</td>
                                            <td>100</td>
                                            <td>200</td>
                                        </tr>
                                        :
                                        <tr key={index}>
                                            <td>{i + 1}</td>
                                            <td>{material.code}</td>
                                            <td>{material.name}</td>
                                            <td>{material.baseUnit}</td>
                                            <td>{material.quantity}</td>
                                            <td>{(good.quantity - good.planedQuantity) * material.quantity}</td>
                                            <td>200</td>
                                        </tr>
                                ))
                            )
                        }
                    </tbody>
                </table>
                <PurchasingRequestCreateForm />
            </div >
        );
    }
}

export default MaterialCalculator;