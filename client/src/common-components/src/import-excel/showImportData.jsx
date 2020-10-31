import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DataTableSetting, SlimScroll, PaginateBar } from '../../../common-components';

class ShowImportData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: this.props.limit,
            page: this.props.page
        };
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
        });
    }

    render() {
        const { id, importData = [], rowError = [], configData, scrollTableWidth = 1000, scrollTable = true, checkFileImport = true } = this.props;
        const { limit, page } = this.state;
        let config = { ...configData }, headerTable = [];
        delete config.sheets;
        delete config.rowHeader;
        delete config.file;

        for (let key in config) {
            let data = config[key];
            headerTable = [...headerTable, { key: key, value: data.value }]
        }
        let columnArr = ["STT"];
        headerTable.forEach(x => {
            if (Array.isArray(x.value)) {
                columnArr = columnArr.concat(x.value);
            } else {
                columnArr = [...columnArr, x.value]
            }
        })

        let pageTotal = (importData.length % limit === 0) ?
            parseInt(importData.length / limit) :
            parseInt((importData.length / limit) + 1);
        let currentPage = parseInt((page / limit) + 1);
        let importDataCurrentPage = importData.slice(page, page + limit);
        return (
            <React.Fragment>
                {
                    !checkFileImport && <span style={{ fontWeight: "bold", color: "red" }}>File import không đúng định dạng </span>
                }
                {
                    importDataCurrentPage.length !== 0 && (
                        <React.Fragment>
                            <DataTableSetting
                                tableId={`importData-${id}`}
                                columnArr={columnArr}
                                limit={limit}
                                setLimit={this.setLimit}
                                hideColumnOption={true}
                            />
                            {rowError.length !== 0 && (
                                <React.Fragment>
                                    <span style={{ fontWeight: "bold", color: "red" }}>Có lỗi xảy ra ở các dòng: {rowError.join(', ')}</span>
                                </React.Fragment>
                            )}
                            <div id={`croll-table-import-${id}`}>
                                <table id={`importData-${id}`} className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            {
                                                headerTable.map((x, index) => {
                                                    if (Array.isArray(x.value)) {
                                                        let arr = x.value;
                                                        return arr.map((y, n) => <th key={n}>{y}</th>)
                                                    } else {
                                                        return <th key={index}>{x.value}</th>
                                                    }
                                                })
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            importDataCurrentPage.map((row, index) => {
                                                return (
                                                    <tr key={index} style={row.error ? { color: "#dd4b39" } : { color: '' }} title={row.errorAlert.join(', ')}>
                                                        <td>{row.STT !== undefined ? row.STT : page + index + 1}</td>
                                                        {headerTable.map((x, indexs) => {
                                                            if (Array.isArray(x.value)) {
                                                                let arr = row[x.key];
                                                                return arr.map((y, n) => <td key={n}>{y}</td>)
                                                            } else {
                                                                return <td key={indexs}>{row[x.key]}</td>
                                                            }
                                                        })}
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </React.Fragment>
                    )}
                {scrollTable && <SlimScroll outerComponentId={`croll-table-import-${id}`} innerComponentId={`importData-${id}`} innerComponentWidth={scrollTableWidth} activate={true} />}
                <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
            </React.Fragment>
        )
    }
}

const showData = connect(null, null)(withTranslate(ShowImportData));
export { showData as ShowImportData };