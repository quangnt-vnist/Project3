import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { CategoryActions} from '../redux/actions';
import { GoodActions } from '../../good-management/redux/actions';
import CategoryCreateForm from './categoryCreateForm';
import CategoryEditForm from './categoryEditForm';
import CategoryDetailForm from './categoryDetailInfo';
import { DataTableSetting, DeleteNotification, PaginateBar, SearchBar } from '../../../../../common-components';

class CategoryManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5,
            option: 'code',
            value: ''
        }
    }

    componentDidMount(){
        let { page, limit } = this.state;
        this.props.getCategories();
        this.props.getCategoryToTree();
        this.props.getCategories({ page, limit });
    }
    
    setPage = (page) => {
        this.setState({ page });
        const data = {
            limit: this.state.limit,
            page: page,
            key: this.state.option,
            value: this.state.value
        };
        this.props.getCategories(data);
    }

    setLimit = (number) => {
        this.setState({ limit: number });
        const data = {
            limit: number,
            page: this.state.page,
            key: this.state.option,
            value: this.state.value
        };
        this.props.getCategories(data);
    }

    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = async () => {
        const data = {
            limit: this.state.limit,
            page: 1,
            key: this.state.option,
            value: this.state.value
        };
        await this.props.getCategories(data);
    }

    handleEdit = async (categories) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: categories
            }
        });

        window.$('#modal-edit-category').modal('show');
    }

    handleShowDetailInfo = async (category) => {
        let id = category._id;
        this.props.getAllGoodsByCategory(id);
        await this.setState(state => {
            return {
                ...state,
                currentRow: category
            }
        })
        window.$('#modal-detail-category').modal('show');
    }

    render (){
        const { categories, translate } = this.props;
        const { listPaginate, totalPages, page, categoryToTree } = categories;
        console.log(categoryToTree);

        return (
            <div className="box">
                <div className="box-body qlcv">
                    <CategoryCreateForm />

                    <SearchBar 
                        columns={[
                        { title: translate('manage_warehouse.category_management.code'), value: 'code' },
                        { title: translate('manage_warehouse.category_management.name'), value: 'name' },
                        { title: translate('manage_warehouse.category_management.type'), value: 'type' }
                        ]}
                        valueOption = {{ nonSelectedText: translate('manage_warehouse.category_management.choose_type'), allSelectedText: translate('manage_warehouse.category_management.all_type') }}
                        typeColumns={[
                            { value: "product", title: translate('manage_warehouse.category_management.product') }, 
                            { value: "material", title: translate('manage_warehouse.category_management.material') }, 
                            { value: "equipment", title: translate('manage_warehouse.category_management.equipment') },
                            { value: "asset", title: translate('manage_warehouse.category_management.asset')}
                            ]}
                        option={this.state.option}
                        setOption={this.setOption}
                        search={this.searchWithOption}
                    />

                    {
                        this.state.currentRow &&
                        <CategoryEditForm
                            categoryId={this.state.currentRow._id}
                            code={this.state.currentRow.code}
                            name={this.state.currentRow.name}
                            type={this.state.currentRow.type}
                            description={this.state.currentRow.description}
                        />
                    }

                    {
                        this.state.currentRow &&
                        <CategoryDetailForm
                            categoryId={this.state.currentRow._id}
                            code={this.state.currentRow.code}
                            name={this.state.currentRow.name}
                            type={this.state.currentRow.type}
                            description={this.state.currentRow.description}
                        />
                    }

                    <table id="category-table" className="table table-striped table-bordered table-hover" style={{marginTop: '15px'}}>
                        <thead>
                            <tr>
                                <th style={{ width: "5%" }}>{translate('manage_warehouse.category_management.index')}</th>
                                <th>{translate('manage_warehouse.category_management.code')}</th>
                                <th>{translate('manage_warehouse.category_management.name')}</th>
                                <th>{translate('manage_warehouse.category_management.type')}</th>
                                <th>{translate('manage_warehouse.category_management.description')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                <DataTableSetting
                                        tableId="category-table"
                                        columnArr={[
                                            translate('manage_warehouse.category_management.index'),
                                            translate('manage_warehouse.category_management.code'),
                                            translate('manage_warehouse.category_management.name'),
                                            translate('manage_warehouse.category_management.type'),
                                            translate('manage_warehouse.category_management.description')
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
                                        <td>{translate(`manage_warehouse.category_management.${x.type}`)}</td>
                                        <td>{x.description}</td>
                                        <td style={{textAlign: 'center'}}>
                                            <a className="text-green" onClick={() => this.handleShowDetailInfo(x)}><i className="material-icons">visibility</i></a>
                                            <a onClick={() => this.handleEdit(x)} href={`#${x._id}`} className="text-yellow" ><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('manage_warehouse.category_management.delete_info')}
                                                data={{
                                                    id: x._id,
                                                    info: x.code + " - " + x.name
                                                }}
                                                func={this.props.deleteCategory}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {categories.isLoading ?
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
    const { categories, goods } = state;
    return { categories, goods };
}

const mapDispatchToProps = {
    getCategories: CategoryActions.getCategories,
    getCategoryToTree: CategoryActions.getCategoryToTree,
    getAllGoodsByCategory: GoodActions.getAllGoodsByCategory,
    deleteCategory: CategoryActions.deleteCategory
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CategoryManagementTable));