import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { GoodActions } from '../redux/actions';
import { CategoryActions } from '../../category-management/redux/actions';
import { DataTableSetting, DeleteNotification, PaginateBar, SelectMulti } from '../../../../../common-components';
import GoodCreateForm from './goodCreateFrom';
import GoodEditForm from './goodEditForm';
import GoodDetailForm from './goodDetailForm';


class GoodManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5,
            code: '',
            name: '',
            category: '',
            value: '',
            type: 'product',
        }
    }

    componentDidMount(){
        let { page, limit, type, autoType } = this.state;
        this.props.getGoodsByType();
        this.props.getGoodsByType({ page, limit, type });
        this.props.getCategoriesByType({ type });
    }
    
    setPage = (page) => {
        this.setState({ page });
        const data = {
            limit: this.state.limit,
            page: page,
            key: this.state.option,
            value: this.state.value,
            type: this.state.type,
        };
        this.props.getGoodsByType(data);
    }

    setLimit = (number) => {
        this.setState({ limit: number });
        const data = {
            limit: number,
            page: this.state.page,
            key: this.state.option,
            value: this.state.value,
            type: this.state.type,
        };
        this.props.getGoodsByType(data);
    }

    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    handleEdit = async (goods) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: goods
            }
        });

        window.$('#modal-edit-goods').modal('show');
    }

    handleProduct = async () => {
        let type = 'product'
        let page = 1;
        this.setState({
            page: page,
            type: type,
            category: ''
        })
        const { limit } = this.state;
        await this.props.getGoodsByType({ page, limit, type });
        await this.props.getCategoriesByType({ type });
    }

    handleMaterial = async () => {
        let type = 'material';
        let page = 1;
        this.setState({
            page: page,
            type: type,
            category: ''
        })
        const { limit } = this.state;
        await this.props.getGoodsByType({ page, limit, type });
        await this.props.getCategoriesByType({ type });
    }

    handleEquipment = async () => {
        let type = 'equipment'
        let page = 1;
        this.setState({
            page: page,
            type: type,
            category: ''
        })
        const { limit } = this.state;
        await this.props.getGoodsByType({ page, limit, type });
        await this.props.getCategoriesByType({ type });
    }

    handleAsset = async () => {
        let type = 'asset';
        let page = 1;
        this.setState({
            page: page,
            type: type,
            category: ''
        })
        const { limit } = this.state;
        await this.props.getGoodsByType({ page, limit, type });
        await this.props.getCategoriesByType({ type });
    }

    getCategoriesByType = () => {
        let { categories } = this.props;
        let listCategoriesByType = categories.listCategoriesByType;
        let categoryArr = [];

        listCategoriesByType.map(item => {
            categoryArr.push({
                value: item._id,
                text: item.name
            })
        })

        return categoryArr;
    }

    handleCodeChange = async (e) => {
        const value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                code: value.trim(),
            }
        })
    }

    handleNameChange = async (e) => {
        const value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                name: value.trim(),
            }
        })
    }

    handleCategoryChange = async (value) => {
        this.setState(state => {
            return {
                ...state,
                category: value
            }
        })
    }

    handleSubmitSearch = async () => {
        const data = {
            limit: this.state.limit,
            page: this.state.page,
            type: this.state.type,
            code: this.state.code,
            name: this.state.name,
            category: this.state.category
        };
        await this.props.getGoodsByType(data);
    }

    handleEdit = async (goods) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: goods
            }
        })
        window.$('#modal-edit-good').modal('show');
    }

    handleShowDetailInfo = async (good) => {
        let id = good._id;
        this.props.getGoodDetail(id);
        await this.setState(state => {
            return {
                ...state,
                currentRow: good
            }
        })
        window.$('#modal-detail-good').modal('show');
    }

    render() {

        const { goods, categories, translate } = this.props;
        const { listCategoriesByType } = categories;
        const { type } = this.state;
        const { listPaginate, totalPages, page } = goods;
        const dataSelectBox = this.getCategoriesByType();

        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#good-products" data-toggle="tab" onClick={()=> this.handleProduct()}>{translate('manage_warehouse.good_management.product')}</a></li>
                    <li><a href="#good-materials" data-toggle="tab" onClick={this.handleMaterial}>{translate('manage_warehouse.good_management.material')}</a></li>
                    <li><a href="#good-equipments" data-toggle="tab" onClick={()=> this.handleEquipment()}>{translate('manage_warehouse.good_management.equipment')}</a></li>
                    <li><a href="#good-assets" data-toggle="tab" onClick={()=> this.handleAsset()}>{translate('manage_warehouse.good_management.asset')}</a></li>
                </ul>
                <div className="box-body qlcv">
                    <GoodCreateForm type={ type } />
                    {
                        this.state.currentRow &&
                        <GoodEditForm
                            goodId={this.state.currentRow._id}
                            code={this.state.currentRow.code}
                            name={this.state.currentRow.name}
                            type={this.state.currentRow.type}
                            category={this.state.currentRow.category}
                            baseUnit={this.state.currentRow.baseUnit}
                            units={this.state.currentRow.units}
                            materials={this.state.currentRow.materials}
                            description={this.state.currentRow.description}
                        />
                    }

                    {
                        this.state.currentRow &&
                        <GoodDetailForm
                            goodId={this.state.currentRow._id}
                            code={this.state.currentRow.code}
                            name={this.state.currentRow.name}
                            type={this.state.currentRow.type}
                            category={this.state.currentRow.category}
                            baseUnit={this.state.currentRow.baseUnit}
                            units={this.state.currentRow.units}
                            materials={this.state.currentRow.materials}
                            description={this.state.currentRow.description}
                        />
                    }
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.good_management.code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleCodeChange} placeholder={translate('manage_warehouse.good_management.code')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.good_management.name')}</label>
                            <input type="text" className="form-control" name="name" onChange={this.handleNameChange} placeholder={translate('manage_warehouse.good_management.name')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.good_management.category')}</label>
                            <SelectMulti
                                id={`select-multi-${type}`}
                                multiple="multiple"
                                options={{ nonSelectedText: translate('manage_warehouse.good_management.choose_type'), allSelectedText: translate('manage_warehouse.good_management.all_type') }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={dataSelectBox}
                                onChange={this.handleCategoryChange}
                            />
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('manage_warehouse.good_management.search')} onClick={this.handleSubmitSearch}>{translate('manage_warehouse.good_management.search')}</button>
                        </div>
                    </div>

                        <table id={`good-table-${type}`} className="table table-striped table-bordered table-hover" style={{marginTop: '15px'}}>
                            <thead>
                                <tr>
                                    <th style={{ width: "5%" }}>{translate('manage_warehouse.good_management.index')}</th>
                                    <th>{translate('manage_warehouse.good_management.code')}</th>
                                    <th>{translate('manage_warehouse.good_management.name')}</th>
                                    <th>{translate('manage_warehouse.good_management.category')}</th>
                                    <th>{translate('manage_warehouse.good_management.unit')}</th>
                                    { type === 'product' ?
                                    <th>{translate('manage_warehouse.good_management.materials')}</th>:
                                    []
                                    }
                                    <th>{translate('manage_warehouse.good_management.description')}</th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                    <DataTableSetting
                                            tableId={`good-table-${type}`}
                                            columnArr={[
                                                translate('manage_warehouse.good_management.index'),
                                                translate('manage_warehouse.good_management.code'),
                                                translate('manage_warehouse.good_management.name'),
                                                translate('manage_warehouse.good_management.category'),
                                                translate('manage_warehouse.good_management.unit'),
                                                type === 'product' ?
                                                translate('manage_warehouse.good_management.materials'): [],
                                                translate('manage_warehouse.good_management.description')
                                            ]}
                                            limit={this.state.limit}
                                            setLimit={this.setLimit}
                                            hideColumnOption={true}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                { (typeof listPaginate !== undefined && listPaginate.length !== 0) &&
                                    listPaginate.map((x, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{x.code}</td>
                                            <td>{x.name}</td>
                                            <td>{x.category && listCategoriesByType.length && listCategoriesByType.filter(item => item._id === x.category).pop() ? listCategoriesByType.filter(item => item._id === x.category).pop().name : ""}</td>
                                            <td>{x.baseUnit}</td>
                                            { type === 'product' ? 
                                            <td>{x.materials.map((y, i) => <p key={i}>{y.good.name},</p>)}</td>:
                                            []
                                            }
                                            <td>{x.description}</td>
                                            <td style={{textAlign: 'center'}}>
                                                <a className="text-green" onClick={() => this.handleShowDetailInfo(x)}><i className="material-icons">visibility</i></a>
                                                <a onClick={() => this.handleEdit(x)} href={`#${x._id}`} className="text-yellow" ><i className="material-icons">edit</i></a>
                                                <DeleteNotification
                                                    content={translate('manage_warehouse.good_management.delete_info')}
                                                    data={{
                                                        id: x._id,
                                                        info: x.code + " - " + x.name,
                                                    }}
                                                    func={this.props.deleteGood}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {goods.isLoading ?
                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                            (typeof listPaginate === 'undefined' || listPaginate.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                        <PaginateBar pageTotal = {totalPages} currentPage = {page} func = {this.setPage} />
                    </div>
            </div>
        );
    }
    
}

function mapStateToProps(state) {
    const { goods, categories } = state;
    return { goods, categories };
}

const mapDispatchToProps = {
    getGoodsByType: GoodActions.getGoodsByType,
    getCategoriesByType: CategoryActions.getCategoriesByType,
    deleteGood: GoodActions.deleteGood,
    getGoodDetail: GoodActions.getGoodDetail
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodManagement));
