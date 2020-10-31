import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, Errorstrong, ButtonModal } from '../../../../../../common-components';
import { translate } from 'react-redux-multilingual/lib/utils';

class ArchiveDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { translate, binLocations } = this.props;
        const { binLocationDetail } = binLocations;
        const {path, status, department, description, capacity, contained, users, enableGoods, unit } = binLocationDetail;
        
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-detail-archive-bin`}
                    formID={`form-detail-archive-bin`}
                    title={translate('manage_warehouse.bin_location_management.add_title')}
                    msg_success={translate('manage_warehouse.bin_location_management.add_success')}
                    msg_faile={translate('manage_warehouse.bin_location_management.add_faile')}
                    size={75}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form id={`form-detail-archive-bin`} >
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bin_location_management.code')}:&emsp;</strong>
                                    {path}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bin_location_management.status')}:&emsp;</strong>
                                   {status && <span style={{ color: translate(`manage_warehouse.bin_location_management.${status}.color`)}}>{translate(`manage_warehouse.bin_location_management.${status}.status`)}</span>}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bin_location_management.department')}:&emsp;</strong>
                                    {department ? department.name : ""}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bin_location_management.capacity')}:&emsp;</strong>
                                    {capacity ? capacity : 0} {unit}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bin_location_management.contained')}:&emsp;</strong>
                                    {contained ? contained : 0} {unit}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bin_location_management.management_location')}:&emsp;</strong>
                                    {users ? users.map(x => x.name) : ""}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bin_location_management.description')}:&emsp;</strong>
                                    {description}
                                </div>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.bin_location_management.enable_good')}</legend>

                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th title={translate('manage_warehouse.bin_location_management.good')}>{translate('manage_warehouse.bin_location_management.good')}</th>
                                                <th title={translate('manage_warehouse.bin_location_management.type')}>{translate('manage_warehouse.bin_location_management.type')}</th>
                                                <th title={translate('manage_warehouse.bin_location_management.contained')}>{translate('manage_warehouse.bin_location_management.contained')}</th>
                                                <th title={translate('manage_warehouse.bin_location_management.max_quantity')}>{translate('manage_warehouse.bin_location_management.max_quantity')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`good-edit-manage-by-archive`}>
                                            {
                                                (typeof enableGoods === 'undefined' || enableGoods.length === 0) ? <tr><td colSpan={4}><center>{translate('task_template.no_data')}</center></td></tr> :
                                                enableGoods.map((x, index) =>
                                                    <tr key={index}>
                                                        <td>{x.good ? x.good.name : ""}</td>
                                                        <td>{x.good ? translate(`manage_warehouse.bin_location_management.${x.good.type}`) : ""}</td>
                                                        <td>{x.contained} {x.good ? x.good.baseUnit : ""}</td>
                                                        <td>{x.capacity} {x.good ? x.good.baseUnit : ""}</td>
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

const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(withTranslate(ArchiveDetailForm));