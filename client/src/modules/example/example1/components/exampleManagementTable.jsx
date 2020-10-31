import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { exampleActions } from "../redux/actions";
import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../common-components";
import ExampleCreateForm from "./exampleCreateForm";
import ExampleEditForm from "./exampleEditForm";

class ExampleManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exampleName: "",
            description: "",
            page: 0,
            limit: 5
        };
    }

    componentDidMount() {
        let { exampleName, page, limit } = this.state;
        this.props.getExamples({ exampleName, page, limit });
    }

    handleChangeExampleName = (e) => {
        const { value } = e.target;
        this.setState({
            exampleName: value
        });
    }

    handleSubmitSearch = async () => {
        await this.setState({
            page: 0
        });
        this.props.getExamples(this.state);
    }

    setPage = async (pageNumber) => {
        var currentPage = pageNumber - 1;
        await this.setState({
            page: parseInt(currentPage)
        });

        this.props.getExamples(this.state);
    }

    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number)
        });
        this.props.getExamples(this.state);
    }

    handleDelete = (id) => {
        this.props.deleteExample(id);
    }

    handleEdit = async (example) => {
        await this.setState((state) => {
            return {
                ...state,
                currentRow: example
            }
        });
        window.$('#modal-edit-example').modal('show');
    }

    render() {
        const { example, translate } = this.props;
        let lists = [];
        if (example.isLoading === false) {
            lists = example.lists
        }

        const totalPage = Math.ceil(example.totalList / this.state.limit);
        const page = this.state.page;
        return (
            <React.Fragment>
                {
                    this.state.currentRow &&
                    <ExampleEditForm
                        exampleID={this.state.currentRow._id}
                        exampleName={this.state.currentRow.exampleName}
                        description={this.state.currentRow.description}
                    />
                }
                <div className="box-body qlcv">
                    <ExampleCreateForm />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_example.exampleName')}</label>
                            <input type="text" className="form-control" name="exampleName" onChange={this.handleChangeExampleName} placeholder={translate('manage_example.exampleName')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manage_example.search')} onClick={this.handleSubmitSearch}>{translate('manage_example.search')}</button>
                        </div>
                    </div>
                    <table id="example-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('manage_example.index')}</th>
                                <th>{translate('manage_example.exampleName')}</th>
                                <th>{translate('manage_example.description')}</th>
                                <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId="example-table"
                                        columnArr={[
                                            translate('manage_example.index'),
                                            translate('manage_example.exampleName'),
                                            translate('manage_example.description'),
                                        ]}
                                        limit={this.state.limit}
                                        hideColumnOption={true}
                                        setLimit={this.setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(lists && lists.length !== 0) &&
                                lists.map((example, index) => (
                                    <tr key={index}>
                                        <td>{index + 1 + page * this.state.limit}</td>
                                        <td>{example.exampleName}</td>
                                        <td>{example.description}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => this.handleEdit(example)}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('manage_example.delete')}
                                                data={{
                                                    id: example._id,
                                                    info: example.exampleName
                                                }}
                                                func={this.props.deleteExample}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {example.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={totalPage ? totalPage : 0} currentPage={page + 1} func={this.setPage} />
                </div>
            </React.Fragment>
        )
    }
}


function mapStateToProps(state) {
    const example = state.example1;
    return { example }
}

const mapDispatchToProps = {
    getExamples: exampleActions.getExamples,
    deleteExample: exampleActions.deleteExample
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ExampleManagementTable));