import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import './treeTable.css';

class TreeTable extends Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        if (this.props.data !== null && this.props.behaviour === "show-children") {
            this.addScriptTreeTable(true);
        }
        if (this.props.data !== null && this.props.behaviour === "hide-children") {
            this.addScriptTreeTable(false);
        }
    }

    /**
     * Function thêm script cho tree table
     * @showChildren = true : hiện thị nút con
     * @showChildren = false : Ẩn nút con
     */
    addScriptTreeTable = (showChildren = true) => {
        const { tableId = 'tree-table' } = this.props;
        window.$(function () {
            let
                $table = window.$(`#${tableId}`),
                rows = $table.find('tr');

            rows.each(function (index, row) {
                let
                    $row = window.$(row),
                    level = $row.data('level'),
                    id = $row.data('id'),
                    $columnName = $row.find('td[data-column="name"]'),
                    children = $table.find('tr[data-parent="' + id + '"]')
                //  var tagSpan = $columnName.find("span").length;


                let div = window.$("<div/>").attr({
                    "style": "display: inline-block; margin-left: " + (15 + 30 * (level - 1)) + "px"
                }).html($columnName.text());
                if (children.length) {
                    let expander = window.$('<span />').attr('class', `treegrid-expander glyphicon ${showChildren ? "glyphicon-chevron-down" : "glyphicon-chevron-right"}`).html('');
                    div.prepend(expander);

                    { showChildren ? children.show() : children.hide() }
                    expander.on('click', function (e) {
                        let $target = window.$(e.target);
                        if ($target.hasClass('glyphicon-chevron-right')) {
                            $target
                                .removeClass('glyphicon-chevron-right')
                                .addClass('glyphicon-chevron-down');

                            children.show();
                            reverseShow($table, $row);
                        } else {
                            $target
                                .removeClass('glyphicon-chevron-down')
                                .addClass('glyphicon-chevron-right');

                            reverseHide($table, $row);
                        }
                    });
                }
                $columnName.html('');
                $columnName.append(div);
            });

            // Reverse hide all elements
            const reverseHide = (table, element) => {
                let
                    $element = window.$(element),
                    id = $element.data('id'),
                    children = table.find('tr[data-parent="' + id + '"]');

                if (children.length) {
                    children.each(function (i, e) {
                        reverseHide(table, e);
                    });

                    $element
                        .find('glyphicon-chevron-down')
                        .removeClass('glyphicon-chevron-down')
                        .addClass('glyphicon-chevron-right');

                    children.hide();
                }
            };

            // Reverse show all elements
            const reverseShow = (table, element) => {
                let
                    $element = window.$(element),
                    id = $element.data('id'),
                    children = table.find('tr[data-parent="' + id + '"]');

                if (children.length) {
                    children.each(function (i, e) {
                        reverseShow(table, e);
                    });

                    $element
                        .find('.glyphicon-chevron-right')
                        .removeClass('glyphicon-chevron-right')
                        .addClass('glyphicon-chevron-down');

                    children.show();
                }
            };
        });
    }

    /**
     * Function thực hiện format dữ liệu truyền vào
     * @param {*} column : Dữ liệu cột của bảng
     * @param {*} data : Dữ liệu hiện thị trong bảng
     */
    dataTreetable = (column, data) => {
        let keyColumn = column.map(col => col.key);
        let newarr = [];

        // Function chuyển đổi list thành tree 
        let listToTree = (items, parent_id = null, link = 'parent') =>
            items.filter(item => item[link] === parent_id).map(item => ({ ...item, children: listToTree(items, item._id) }));

        // Chuyển đổi dữ liệu truyền vào thành dạng tree trước khi gọi đệ quy
        let list1 = data;
        data = listToTree(data);

        let findData = (root, id) => {
            let queue = [];
            queue.push(root);

            while (queue.length !== 0) {
                let item = queue.pop();

                if (item._id === id) {
                    return true;
                }

                for (let k in item.children) {
                    queue.push(item.children[k]);
                }
            }
            
            return false;
        }

        // Thêm các công việc không tìm được cha vào mảng data
        let concatArray = [];
        for (let i in list1) {
            let flag = true;
            for (let j in data) {
                if (findData(data[j], list1[i]._id)) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                concatArray.push(list1[i]);
            }
        }
        data = data.concat(concatArray);

        // Function đệ quy để thêm level tương ứng cho dữ liệu truyền vào đã được chuyển thành dạnh tree
        // Trả vể mảng là dữ liệu trước khi thực hiện function listToTree và dữ liệu này đã được sắp xếp
        let convertData = (arr, level = 1) => {
            if (arr !== undefined) {
                arr.map(item => {
                    newarr.push({ ...item, "level": level });
                    convertData(item.children, level + 1);
                    return true;
                });
            }

            return newarr;
        }
        // Gọi đệ quy để thêm level cho dữ liệu truyền vào
        data = convertData(data);

        // Xoá bỏ dữ liệu dư thừa, sắp xếp dữ liệu của data truyền vào theo thứ tự các cột 
        // Gộp nội dung cần hiện thị ở mỗi dòng của bảng thành 1 array với tên là row
        for (let x in data) {
            let node = data[x], row = [];
            row = keyColumn.map(x => {
                for (let n in node) {
                    if (n === x) return node[n];
                }
            })
            data[x] = {
                "_id": node._id,
                "parent": node.parent,
                "action": node.action,
                "level": node.level,
                "row": row
            }
        }
        return data;
    }

    /**
     * Function hiện thị các action tương ứng cho các dòng
     * @param {*} data : Array tên các action của từng dòng
     * @param {*} id : Id dữ liệu tương ứng từng dòng, dùng để gọi server lấy dữ liệu
     */
    showActionColumn = (data, id) => {
        let { titleAction, performtasks } = this.props;
        switch (data) {
            case "edit":
                return <a href="#abc" onClick={() => this.props.funcEdit(id)} className="edit" data-toggle="modal" title={titleAction.edit}>
                    <i className="material-icons"></i>
                </a>
            case "view":
                return <a href="#abc" onClick={() => this.props.funcView(id)} data-toggle="modal" title={titleAction.view}>
                    <i className="material-icons">view_list</i>
                </a>
            case "delete":
                return <a href="#abc" onClick={() => this.props.funcDelete(id)} className="delete" title={titleAction.delete}>
                    <i className="material-icons"></i>
                </a>
            case "add":
                return <a href="#abc" onClick={() => this.props.funcAdd(id)} className="add_circle" data-toggle="modal" title={titleAction.add}>
                    <i className="material-icons">add_circle</i>
                </a>
            case "store":
                return <a href="#abc" onClick={() => this.props.funcStore(id)} className="all_inbox" title={titleAction.store}>
                    <i className="material-icons">all_inbox</i>
                </a>
            case "restore":
                return <a href="#abc" onClick={() => this.props.funcStore(id)} className="all_inbox" title={titleAction.restore}>
                    <i className="material-icons">restore_page</i>
                </a>
            case "startTimer":
                return <a href="#abc" onClick={() => !performtasks.currentTimer && this.props.funcStartTimer(id)} className="timer" title={titleAction.startTimer} disabled={performtasks.currentTimer}>
                    <i className="material-icons">timer</i>
                </a>
            default:
                return null
        }
    }

    render() {
        const { translate, column, data, actions = true, tableId = 'tree-table' } = this.props;

        return (
            <table id={tableId} className="table table-striped table-hover table-bordered">
                <thead>
                    <tr id="task">
                        {column.length !== 0 && column.map((col, index) => <th key={index}>{col.name}</th>)}
                        {actions && <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>}
                    </tr>
                </thead>
                <tbody id="taskTable" className="task-table">
                    {   this.dataTreetable(column, data).length > 0 ?
                        this.dataTreetable(column, data).map((rows, index) => (
                            <tr key={index} data-id={rows._id} data-parent={rows.parent} data-level={rows.level}>
                                {
                                    rows.row.map((x, index) => index === 0 ?
                                        <td key={index} data-column="name">{x}</td> :
                                        <td key={index}>{x}</td>
                                    )
                                }
                                {actions &&
                                    <td>
                                        {
                                            rows.action && rows.action.map((x, index) => Array.isArray(x) ?
                                                <React.Fragment key={index}>
                                                    <button type="button" data-toggle="collapse" data-target={`#actionTask${rows._id}`} style={{ border: "none", background: "none" }}><i className="fa fa-ellipsis-v"></i></button>
                                                    <div id={`actionTask${rows._id}`} className="collapse">
                                                        {x.map((y, index) => (
                                                            <React.Fragment key={index}>
                                                                {this.showActionColumn(y, rows._id)}
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                </React.Fragment> :
                                                <React.Fragment key={index}>
                                                    {this.showActionColumn(x, rows._id)}
                                                </React.Fragment>
                                            )
                                        }
                                    </td>
                                }
                            </tr>
                        )) :
                        <tr><td colSpan={ column.length + 1 }><center>{translate('task_template.no_data')}</center></td></tr>
                    }
                </tbody>
            </table >
        );
    }
}

function mapState(state) {
    const { performtasks } = state;
    return { performtasks };
}

const treeTable = connect(mapState, null)(withTranslate(TreeTable));

export { treeTable as TreeTable }