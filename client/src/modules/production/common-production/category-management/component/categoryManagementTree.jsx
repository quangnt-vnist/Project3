import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import { CategoryActions } from '../redux/actions';
import CategoryEditTree from './categoryEditTree';
import CategoryCreateTree from './categoryCreateTree';
import { Tree, SlimScroll, ExportExcel } from '../../../../../common-components';
import './category.css';

class CategoryManagementTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryParent: [],
            deleteNode: [],
        }
    }

    componentDidMount() {
        this.props.getCategoryToTree()
    }

    onChanged = async (e, data) => {
        await this.setState({
            currentCategory: data.node,

        })
        window.$(`#edit-category-good`).slideDown();
    }

    checkNode = (e, data) => {
        this.setState({
            categoryParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d]
        })
    }

    unCheckNode = (e, data) => {
        this.setState({
            categoryParent: [...data.selected],
            deleteNode: [...data.selected],

        })
    }

    handleAddCategory = (event) => {
        event.preventDefault();
        window.$('#modal-create-category-good').modal('show');
    }

    deleteCategory = () => {
        const { translate } = this.props;
        const { deleteNode, categoryParent } = this.state;
        Swal.fire({
            html: `<h4 style="color: red"><div>Xóa lưu trữ</div>?</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then((result) => {
            if (result.value && categoryParent.length > 1) {
                this.props.deleteCategory(categoryParent, "many");
                this.setState({
                    deleteNode: [],
                    categoryParent: []
                });
            } else if (result.value && categoryParent.length === 1) {
                this.props.deleteCategory(categoryParent, 'single');
                this.setState({
                    deleteNode: [],
                    categoryParent: []
                });
            }
        })
    }

    render() {
        const { categoryParent, deleteNode, currentCategory } = this.state;
        const { translate, categories } = this.props;
        const { list, tree } = categories.categoryToTree;

        const dataTree = list ? list.map(node => {
            return {
                ...node,
                text: node.name,
                state: { "open": true },
                id: node._id,
                parent: node.parent ? node.parent.toString() : "#"
            }
        }) : null;
        return (
            <React.Fragment>

                <div className="form-inline">
                    <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                        <button type="button" className="btn btn-success dropdown-toggler pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('manage_warehouse.category_management.add')}
                            disabled={categoryParent.length > 1 ? true : false}>{translate('manage_warehouse.category_management.add')}</button>
                        <ul className="dropdown-menu pull-right">
                            <li><a href="#modal-create-category-good" title="Add category" onClick={(event) => { this.handleAddCategory(event) }}>{translate('manage_warehouse.category_management.add')}</a></li>
                            <li><a href="#modal_import_file_category_good" title="ImportForm" onClick={(event) => { this.handImportFile(event) }}>ImportFile</a></li>
                        </ul>
                    </div>
                </div>

                {
                    deleteNode.length > 0 && <button className="btn btn-danger" style={{ marginLeft: '5px' }} onClick={this.deleteCategory}>{translate('general.delete')}</button>
                }
                <CategoryCreateTree categoryParent = {this.state.categoryParent[0]} />
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="category-tree" id="category-tree">
                            <Tree
                                id="tree-qlcv-category-good"
                                onChanged={this.onChanged}
                                checkNode={this.checkNode}
                                unCheckNode={this.unCheckNode}
                                data={dataTree}
                            />
                        </div>
                        <SlimScroll outerComponentId="category-tree" innerComponentId="tree-qlcv-category-good" innerComponentWidth={"100%"} activate={true} />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        {
                            currentCategory && 
                            <CategoryEditTree
                                categoryId={currentCategory.id}
                                categoryCode={currentCategory.original.code}
                                categoryName={currentCategory.text}
                                categoryParent={currentCategory.parent}
                                categoryDescription={currentCategory.original.description}
                            />
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getCategoryToTree: CategoryActions.getCategoryToTree,
    deleteCategory: CategoryActions.deleteCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CategoryManagementTree));