import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, Errorstrong, ButtonModal } from '../../../../../common-components';
import { StockActions } from '../redux/actions';
import { translate } from 'react-redux-multilingual/lib/utils';

class StockDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.stockId !== prevState.stockId || nextProps.code !== prevState.code || nextProps.name !== prevState.name ||
            nextProps.status !== prevState.status || nextProps.address !== prevState.address || nextProps.goods !== prevState.goods ||
            nextProps.managementLocation !== prevState.managementLocation || nextProps.manageDepartment !== prevState.manageDepartment || nextProps.description !== prevState.description){
            return {
                ...prevState,
                stockId: nextProps.stockId,
                code: nextProps.code,
                name: nextProps.name,
                status: nextProps.status,
                address: nextProps.address,
                goods: nextProps.goodsManagement,
                managementLocation: nextProps.managementLocation,
                manageDepartment: nextProps.manageDepartment,
                description: nextProps.description,
            }
        }
        else {
            return null;
        }
    }
    render() {
        const { translate, stocks, department, role } = this.props;
        const { code, name, managementLocation, status, address, description, manageDepartment, goods, good } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-detail-stock`} isLoading={stocks.isLoading}
                    formID={`form-detail-stock`}
                    title={translate('manage_warehouse.stock_management.add_title')}
                    msg_success={translate('manage_warehouse.stock_management.add_success')}
                    msg_faile={translate('manage_warehouse.stock_management.add_faile')}
                    size={75}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form id={`form-detail-stock`} >
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.stock_management.code')}:&emsp;</strong>
                                    {code}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.stock_management.address')}:&emsp;</strong>
                                    {address}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.stock_management.department')}:&emsp;</strong>
                                    {manageDepartment && department.list.length && department.list.filter(item => item._id === manageDepartment).pop() ? department.list.filter(item => item._id === manageDepartment).pop().name : 'Department is deleted'}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.stock_management.name')}:&emsp;</strong>
                                    {name}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.stock_management.status')}:&emsp;</strong>
                                    {translate(`manage_warehouse.stock_management.${status}`)}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.stock_management.management_location')}:&emsp;</strong>
                                    <div style={{marginLeft:"40%"}}>{managementLocation.map((x, index) => 
                                        <p key={index}>{role.list.filter(item => item._id === x).pop().name}</p>
                                    )}</div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.stock_management.description')}:&emsp;</strong>
                                    {description}
                                </div>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.stock_management.goods')}</legend>

                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th title={translate('manage_warehouse.stock_management.good')}>{translate('manage_warehouse.stock_management.good')}</th>
                                                <th title={translate('manage_warehouse.stock_management.min_quantity')}>{translate('manage_warehouse.stock_management.min_quantity')}</th>
                                                <th title={translate('manage_warehouse.stock_management.max_quantity')}>{translate('manage_warehouse.stock_management.max_quantity')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`good-edit-manage-by-stock`}>
                                            {
                                                (typeof goods === 'undefined' || goods.length === 0) ? <tr><td colSpan={3}><center>{translate('task_template.no_data')}</center></td></tr> :
                                                goods.map((x, index) =>
                                                    <tr key={index}>
                                                        <td>{x.good.name}</td>
                                                        <td>{x.minQuantity}</td>
                                                        <td>{x.maxQuantity}</td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}
function mapStateToProps(state) {
    const { stocks, department, role, goods } = state;
    return { stocks, department, role, goods };
}

const mapDispatchToProps = {
    getStock: StockActions.getStock
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(StockDetailForm));