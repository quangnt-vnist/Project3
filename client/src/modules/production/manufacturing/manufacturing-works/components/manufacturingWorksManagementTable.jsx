import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { worksActions } from '../redux/actions';
import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../../common-components";
import ManufacturingWorksCreateForm from './manufacturingWorksCreateForm';
import ManufacturingWorksDetailForm from './manufacturingWorksDetailForm';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import ManufacturingWorksEditForm from './manufacturingWorksEditForm';
class ManufacturingWorksManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5,
            code: '',
            name: ''
        }
    }

    componentDidMount = () => {
        const { page, limit } = this.state;
        this.props.getAllManufacturingWorks({ page, limit });
        this.props.getAllUserOfCompany();
    }

    setPage = async (page) => {
        await this.setState({
            page: page
        });
        const data = {
            limit: this.state.limit,
            page: page,
        };
        this.props.getAllManufacturingWorks(data);
    }

    setLimit = async (limit) => {
        await this.setState({
            limit: limit
        });
        const data = {
            limit: limit,
            page: this.state.page
        }
        this.props.getAllManufacturingWorks(data);
    }

    handleChangeWorksName = (e) => {
        const { value } = e.target;
        this.setState({
            name: value
        })
    }

    handleChangeWorksCode = (e) => {
        const { value } = e.target;
        this.setState({
            code: value
        })
    }

    handleSubmitSearch = async () => {
        await this.setState({
            page: 1
        });
        const data = {
            page: this.state.page,
            limit: this.state.limit,
            code: this.state.code,
            name: this.state.name
        }
        this.props.getAllManufacturingWorks(data);
    }

    handleShowDetailWorks = async (id) => {
        await this.setState((state) => {
            return {
                ...state,
                worksId: id
            }
        })
        window.$('#modal-detail-info-works').modal('show');
    }

    handleEditWorks = async (works) => {
        await this.setState((state) => {
            return {
                ...state,
                currentRow: works
            }
        });
        window.$('#modal-edit-works').modal('show');
    }

    render() {
        const { translate } = this.props;
        const { manufacturingWorks } = this.props;
        const { totalPages, page } = manufacturingWorks;
        let listWorks = [];
        if (manufacturingWorks.isLoading === false) {
            listWorks = manufacturingWorks.listWorks;
        }
        return (
            <React.Fragment>
                {
                    <ManufacturingWorksDetailForm worksId={this.state.worksId} />
                }
                {  this.state.currentRow &&
                    <ManufacturingWorksEditForm
                        worksId={this.state.currentRow._id}
                        code={this.state.currentRow.code}
                        name={this.state.currentRow.name}
                        worksManagerValue={this.state.currentRow.worksManager._id}
                        foremanValue={this.state.currentRow.foreman._id}
                        phoneNumber={this.state.currentRow.phoneNumber}
                        address={this.state.currentRow.address}
                        status={this.state.currentRow.status}
                        description={this.state.currentRow.description}

                    />
                }
                <div className="box-body qlcv">
                    <ManufacturingWorksCreateForm />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.manufacturing_works.code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeWorksName} placeholder="NMSX201015153823" autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.manufacturing_works.name')}</label>
                            <input type="text" className="form-control" name="name" onChange={this.handleChangeWorksCode} placeholder="Nhà máy sản xuất thuốc Việt Anh I" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manufacturing.manufacturing_works.search')} onClick={this.handleSubmitSearch}>{translate('manufacturing.manufacturing_works.search')}</button>
                        </div>
                    </div>
                    <table id="manufacturing-works-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('manufacturing.manufacturing_works.index')}</th>
                                <th>{translate('manufacturing.manufacturing_works.code')}</th>
                                <th>{translate('manufacturing.manufacturing_works.name')}</th>
                                <th>{translate('manufacturing.manufacturing_works.worksManager')}</th>
                                <th>{translate('manufacturing.manufacturing_works.foreman')}</th>
                                {/* <th>{translate('manufacturing.manufacturing_works.mills')}</th> */}
                                <th>{translate('manufacturing.manufacturing_works.phone')}</th>
                                <th>{translate('manufacturing.manufacturing_works.address')}</th>
                                <th>{translate('manufacturing.manufacturing_works.description')}</th>
                                <th>{translate('manufacturing.manufacturing_works.status')}</th>
                                <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId="manufacturing-works-table"
                                        columnArr={[
                                            translate('manufacturing.manufacturing_works.index'),
                                            translate('manufacturing.manufacturing_works.code'),
                                            translate('manufacturing.manufacturing_works.name'),
                                            translate('manufacturing.manufacturing_works.worksManager'),
                                            translate('manufacturing.manufacturing_works.foreman'),
                                            translate('manufacturing.manufacturing_works.mills'),
                                            translate('manufacturing.manufacturing_works.phone'),
                                            translate('manufacturing.manufacturing_works.address'),
                                            translate('manufacturing.manufacturing_works.description'),
                                            translate('manufacturing.manufacturing_works.status')
                                        ]}
                                        limit={this.state.limit}
                                        hideColumnOption={true}
                                        setLimit={this.setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(listWorks && listWorks.length !== 0) &&
                                listWorks.map((works, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{works.code}</td>
                                        <td>{works.name}</td>
                                        <td>{works.worksManager.name}</td>
                                        <td>{works.foreman.name}</td>
                                        {/* <td>{works.manufacturingMills.length > 0 && works.manufacturingMills.map((mill, index) => {
                                            if (works.manufacturingMills.length !== index + 1)
                                                return `${index + 1}. ${mill.name}\n`
                                            return `${index + 1}. ${mill.name}`
                                        })}</td> */}
                                        <td>{works.phoneNumber}</td>
                                        <td>{works.address}</td>
                                        <td>{works.description}</td>
                                        {
                                            works.status
                                                ?
                                                <td style={{ color: "green" }}>{translate('manufacturing.manufacturing_works.1')}</td>
                                                :
                                                <td style={{ color: "orange" }}>{translate('manufacturing.manufacturing_works.0')}</td>
                                        }
                                        <td style={{ textAlign: "center" }}>
                                            <a style={{ width: '5px' }} title={translate('manufacturing.manufacturing_works.works_detail')} onClick={() => { this.handleShowDetailWorks(works._id) }}><i className="material-icons">view_list</i></a>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manufacturing.manufacturing_works.works_edit')} onClick={() => { this.handleEditWorks(works) }}><i className="material-icons">edit</i></a>
                                            {/* <DeleteNotification
                                                content="Xóa nhà máy"
                                                data={{
                                                    id: works._id,
                                                    info: works.code + " - " + works.name
                                                }}
                                                func={this.props.deleteWorks}
                                            /> */}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {manufacturingWorks.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listWorks === 'undefined' || listWorks.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={this.setPage} />
                </div>
            </React.Fragment>
        );
    }
}


function mapStateToProps(state) {
    const manufacturingWorks = state.manufacturingWorks;
    return { manufacturingWorks }
}

const mapDispatchToProps = {
    getAllManufacturingWorks: worksActions.getAllManufacturingWorks,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingWorksManagementTable));