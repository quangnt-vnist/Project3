import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import Sortable from 'sortablejs';
import {ErrorLabel} from '../../../../common-components';
import { TaskTemplateFormValidator} from './taskTemplateFormValidator';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import parse from 'html-react-parser';

class ActionForm extends Component{
    constructor(props){
        super(props);
        let EMPTY_ACTION = {
            name: '',
            description: '',
            mandatory: true,
        };
        console.log('thisporps',this.props.initialData);
        this.state={
            EMPTY_ACTION: Object.assign({}, EMPTY_ACTION),
            editAction: false,
            action:  Object.assign({}, EMPTY_ACTION),
            taskActions:this.props.initialData
        }
    }    

    /**Gửi truy vấn tạo 1 template mới */
    handleSubmit = async (event) => {
        const { newTemplate } = this.state;
        this.props.addNewTemplate(newTemplate);
    }

    componentDidMount(){
        // Load library for sort action table
        this.handleSortable();
    }

    // Drag and drop item in action table
    handleSortable = () => {
        var el1 = document.getElementById('actions');
        Sortable.create(el1, {
            chosenClass: 'chosen',
            animation: 500,
            onChange: function (evt) {
                window.$('#actions tr').each(function (index) {
                    window.$(this).find('td:nth-child(1)').html(index + 1);
                });
            },
            onEnd: async(evt) => {
                let taskActions = this.state.taskActions;
                const item = taskActions[evt.oldIndex];
                taskActions.splice(evt.oldIndex, 1);
                taskActions.splice(evt.newIndex, 0, item);
            }, store:{
                /**
                 * Khắc phục lỗi với thư viện Sortable. Chi tiết lỗi như sau:
                 * Khi lưu thứ tự sắp xếp mới vào state, do state thay đổi, react render lại.
                 * Sortable phát hiện cấu trúc DOM thay đổi nên tự động thay đổi trở lại thứ tự các phần tử
                 * Kết quả: thứ tự trong State lưu một đằng, giao diện hiển thị thể hiện một nẻo
                 **/ 
                set: (sortable) => {
                    let state = this.state;
                    state.keyPrefix = Math.random(); // force react to destroy children
                    state.order = sortable.toArray();
                    this.setState({
                        ...state
                    })
                } 
            }
        });
    }

    /**
     * Bộ xử lý cho Action Form 
    **/
    isActionFormValidated = () => {
        let result = 
        this.validateActionName(this.state.action.name, false)
        return result;
    }

    handleChangeActionName = (event) => {
        let value = event.target.value;
        this.validateActionName(value, true);
    }
    validateActionName = (value, willUpdateState=true) => {
        let msg = TaskTemplateFormValidator.validateActionName(value);

        if (willUpdateState){
            this.state.action.name = value;
            this.state.action.errorOnName = msg;
            this.setState(state =>{
                return{
                    ...state,
                };
            });
        }
        return msg == undefined;
    }

    handleChangeActionDesc = (e, editor) => {
        const description = editor.getData();
        const {action} = this.state;
            this.setState({
                action: {
                    ...action,
                    description
                }
            })
    }

    handleChangeActionMandatory= (event) => {
        let value = event.target.checked;
        this.state.action.mandatory = value;
        this.setState(state =>{
            return{
                ...state
            };
        });
    }
    /** cancel editing an action*/ 
    handleCancelEditAction = (event) => {
        event.preventDefault(); // Ngăn không submit     
        this.setState(state => {
            return {
                ...state,
                editAction: false,
                action: Object.assign({}, state.EMPTY_ACTION),
            }
        });
    }

    /**reset all data fields of action table */ 
    handleClearAction = (event) => {
        event.preventDefault(); // Ngăn không submit
        this.setState(state => {
            return {
                ...state,
                action: Object.assign({}, state.EMPTY_ACTION),
            }
        });
    }

    /**Thêm 1 hoạt động */ 
    handleAddAction = async (event) => {
        event.preventDefault(); // Ngăn không submit
        var EMPTY_ACTION = {
            name: '',
            description: '',
            mandatory: true,
        };
        await this.setState(state => {
            const taskActions = [...this.state.taskActions,state.action];
            return {
                ...state,
                taskActions:taskActions,             
                action: Object.assign({}, state.EMPTY_ACTION),                 
            }           
        });
        this.props.onDataChange(this.state.taskActions);
    }

    /**Sửa các thông tin của hành động */
    handleEditAction = (action, index) => {
        this.setState(state => {
            return {
                ...state,
                editAction: true,
                indexAction: index,
                action: {...action},
            }
        });
    }

    /**Lưu sau khi chỉnh sửa thông tin hoạt động */
    handleSaveEditedAction = async (event) => {
        event.preventDefault(); // Ngăn không submit
        const { indexAction } = this.state;
        let  taskActions  = this.state.taskActions;
        var newTaskActions;
        if (taskActions) {
            newTaskActions = taskActions.map((item, index) => {
                return (index === indexAction) ? this.state.action : item;
            })
        }
        await this.setState(state => {
            return {
                ...state,
                taskActions:newTaskActions,            
                editAction: false,
                action: {...state.EMPTY_ACTION},
            }
        })
        this.props.onDataChange(this.state.taskActions);
    }

   /**Xóa 1 hành động */
    handleDeleteAction = async (index) => {
        let taskActions  = this.state.taskActions;
        let newTaskActionsArray;
        if (taskActions) {
            newTaskActionsArray = taskActions.filter((item, x) => index !== x);
        }
        await this.setState(state => {
            return {
                ...state,
                taskActions:newTaskActionsArray
            }
        })
        this.props.onDataChange(this.state.taskActions);
    }

    render(){
        const { translate } = this.props;
        var { action, taskActions } =this.state;
        const {initialData} = this.props;

        taskActions = initialData;

        return(
            /**Form chứa các thông tin của phần hoạt động của 1 task-template*/
            <fieldset className="scheduler-border">
                <legend className="scheduler-border">{translate('task_template.activity_list')}*</legend>
                
                {/**Tên hoạt động  */}
                <div className={`form-group ${this.state.action.errorOnName===undefined?"":"has-error"}`} >
                    <label className="control-label">{translate('task_template.action_name')}*</label>
                    <div>
                        <input type="text" className="form-control" placeholder={translate('task_template.action_name')} value={action.name} onChange={this.handleChangeActionName} />
                        <ErrorLabel content={this.state.action.errorOnName}/>
                    </div>
                </div>

                {/**Mô tả hoạt động*/}
                <div className={`form-group ${this.state.action.errorOnDescription===undefined?"":"has-error"}`} >
                    <label className="control-label">{translate('task_template.description')}*</label>
                    {/* <div>
                        <textarea type="text" className="form-control" name="description" placeholder={translate('task_template.description')} value={action.description} onChange={this.handleChangeActionDesc} />
                        <ErrorLabel content={this.state.action.errorOnDescription}/>
                    </div> */}
                    <CKEditor
                        editor={ ClassicEditor }
                        onChange={this.handleChangeActionDesc}
                        data={action.description}
                    />
                </div>

                {/**Hoạt động này có bắt buộc không?*/}
                <div className="form-group" >
                    <label className="control-label">
                    {translate('task_template.mandatory')} &nbsp;
                        <input type="checkbox" className="" checked={action.mandatory} onChange={this.handleChangeActionMandatory} />
                    </label>
                </div>
                
                {/**Các button thêm 1 hoạt động, xóa trắng các trường thông tin đã nhập*/}
                <div className="pull-right" style={{ marginBottom: '10px' }}>
                    {this.state.editAction ?
                        <React.Fragment>
                            <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={this.handleCancelEditAction}>{translate('task_template.cancel_editing')}</button>
                            <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isActionFormValidated()} onClick={this.handleSaveEditedAction}>{translate('task_template.save')}</button>
                        </React.Fragment>:
                        <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isActionFormValidated()} onClick={this.handleAddAction}>{translate('task_template.add')}</button>
                    }
                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearAction}>{translate('task_template.delete')}</button>
                </div>

                {/**Table chứa các hoạt động sẵn có*/}
                <table className="table table-hover table-striped table-bordered">
                    <thead>
                        <tr>
                            <th style={{ width: '50px' }} className="col-fixed">STT</th>
                            <th title="Tên hoạt động">{translate('task_template.action_name')}</th>
                            <th title="Mô tả">{translate('task_template.description')}</th>
                            <th style={{ width: '60px' }} title="Bắt buộc">{translate('task_template.mandatory')}</th>
                            <th style={{ width: '60px' }} title="Hành động">{translate('task_template.action')}</th>
                        </tr>
                    </thead>
                    <tbody id="actions">
                        {
                            (typeof taskActions === 'undefined' || taskActions.length === 0) ? <tr><td colSpan={5}><center>{translate('task_template.no_data')}</center></td></tr> :
                                taskActions.map((item, index) =>
                                    <tr key={`${this.state.keyPrefix}_${index}`}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td><div>{parse(item.description)}</div></td>
                                        <td>{item.mandatory ? "Có" : "Không"}</td>
                                        {/**các button sửa, xóa 1 hoạt động */}
                                        <td>
                                            <a href="#abc" className="edit" title="Edit" data-toggle="tooltip" onClick={() => this.handleEditAction(item, index)}><i className="material-icons"></i></a>
                                            <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteAction(index)}><i className="material-icons"></i></a>
                                        </td>
                                    </tr>
                                )
                        }
                    </tbody>
                </table>
            </fieldset>        
        )
    }
}

const actionForm = connect()(withTranslate(ActionForm));
export { actionForm as ActionForm }