import React, { Component } from 'react';
import SelectTree from "react-dropdown-tree-select";
import "./tree-select.css";
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {convertArrayToTree} from '../../../helpers/arrayToTree';
class TreeSelect extends Component {
    constructor(props) {
        super(props);
        this.state = { 
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id || nextProps.data !== prevState.data) {
            return {
                id: nextProps.id,
                value: nextProps.value, // Lưu value ban đầu vào state
                data: nextProps.data,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.data !== this.props.data || nextProps.id !== this.state.id || nextProps.value !== nextState.value) // Chỉ render 1 lần, trừ khi id, value, data thay đổi
            return true;
        return false;  // Tự chủ động update (do đã lưu value vào state)
    }

    onChange = (currentNode, selectedNodes) => {
        const value = selectedNodes.map(node => node._id);
        
        this.setState(state => {
            return {
                ...state,
                value
            }
        });

        this.props.handleChange(value);
    };

    convertData = (array=[], value=[]) => {
        let data = [];
        for (let i = 0; i < array.length; i++) {
            let index = array[i].id ? array[i].id : array[i]._id;
            if(value.indexOf(index) > -1){
                data.push({
                    ...array[i],
                    checked: true
                })
            }else{
                data.push({
                    ...array[i],
                    checked: false
                })
            } 
        }

        return data;
    }

    render() { 
        /**
         * mode có 4 tùy chọn là 
         * 1. multiSelect - chọn phần tử cha mặc định đánh dấu luôn phần tử con
         * 2. hierarchical - chọn phần tử cha không đánh dấu phần tử con
         * 3. simpleSelect - chọn một node trong list - không có dạng cây
         * 4. radioSelect - chọn một node trong cây
         */
        const {mode, data=[], value=[], placeholder=' '} = this.props;
        const getData = this.convertData(data, value);
        const tree = convertArrayToTree(getData);
        return ( <React.Fragment>
            <SelectTree
                data={tree}
                onChange={this.onChange}
                texts={{ placeholder: placeholder }}
                mode={mode}
                className="qlcv"
            />
        </React.Fragment> );
    }
}
 
const mapState = state => state;
const TreeSelectExport = connect(mapState, null)(withTranslate(TreeSelect));

export { TreeSelectExport as TreeSelect }