import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, SelectBox } from '../../../common-components';

import { DepartmentActions } from '../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../super-admin/user/redux/actions';
import { NotificationActions } from '../redux/actions';
import { NotificationValidator } from './notificationValidator';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class NotificationCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationTitle: '',
            notificationLevel: 'info',
            notificationContent: '',
            notificationSender: '',
            notificationUsers: [],
            notificationOrganizationalUnits: []
        }
    }

    componentDidMount(){
        this.props.getDepartment();
        this.props.getUser();
    }

    handleTitle = (e) => {
        let value = e.target.value;
        this.validateTitle(value, true);
    }
    validateTitle = (value, willUpdateState=true) => {
        let msg = NotificationValidator.validateTitle(value)
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    notificationTitleError: msg,
                    notificationTitle: value,
                }
            });
        }
        return msg === undefined;
    }

    handleSender= (e) => {
        let value = e.target.value;
        this.validateSender(value, true);
    }
    validateSender = (value, willUpdateState=true) => {
        let msg = NotificationValidator.validateSender(value)
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    notificationSenderError: msg,
                    notificationSender: value,
                }
            });
        }
        return msg === undefined;
    }

    handleContent = (data) => {
        // let value = e.target.value;
        this.validateContent(data, true);
    }
    validateContent = (value, willUpdateState=true) => {
        let msg = NotificationValidator.validateContent(value)
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    notificationContentError: msg,
                    notificationContent: value,
                }
            });
        }
        return msg === undefined;
    }

    handleLevel = (value) => {
        this.setState(state => {
            return {
                ...state,
                notificationLevel: value[0]
            }
        });
    }

    handleUsersChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                notificationUsers: value
            }
        });
    }

    handleOrganizationalUnitsChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                notificationOrganizationalUnits: value
            }
        });
    }

    save = () => {
        const {
            notificationTitle,
            notificationLevel,
            notificationContent,
            notificationSender,
            notificationUsers,
            notificationOrganizationalUnits
        } = this.state;
        let { auth } = this.props;
        return this.props.create({
            creator: auth.user._id,
            title: notificationTitle,
            level: notificationLevel,
            content: notificationContent,
            sender: notificationSender,
            users: notificationUsers,
            organizationalUnits: notificationOrganizationalUnits
        });
    }

    render() { 
        const { translate, department, user } = this.props;

        return ( 
            <React.Fragment>
                <a style={{width: '100%', marginBottom: '15px'}} className="btn btn-success" title={translate('notification.add_title')} data-toggle="modal" href='#modal-create-notification' data-backdrop="static">{translate('notification.add')}</a>
                <DialogModal
                    modalID="modal-create-notification"
                    formID="form-create-notification"
                    title={translate('notification.add')}
                    func={this.save}
                >
                    <form id="form-create-notification">
                        <div className="row">
                            <div className="form-group col-sm-8">
                                <label>{translate('notification.title')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" onChange={this.handleTitle}/>
                            </div>
                            <div className="form-group col-sm-4">
                                <label>{translate('notification.type.title')}<span className="text-red">*</span></label>
                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                    id={`create-notification-level`}
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {[
                                        {value: 'info', text: translate('notification.type.info')},
                                        {value: 'general', text: translate('notification.type.general')},
                                        {value: 'important', text: translate('notification.type.important')},
                                        {value: 'emergency', text: translate('notification.type.emergency')}
                                    ]}
                                    onChange={this.handleLevel}
                                    multiple={false}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>{translate('notification.sender')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleSender}/>
                        </div>

                        {/* Nội dung */}
                        <div className="form-group">
                            <label>{translate('notification.content')}<span className="text-red">*</span></label>
                            <CKEditor
                                editor={ ClassicEditor }
                                onChange={ ( event, editor ) => {
                                    const data = editor.getData();
                                    this.handleContent(data);
                                } }
                            />
                        </div>

                        <div className="form-group">
                            <label>{ translate('notification.departments') }</label>
                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                id={`notification-to-organizational-units`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {department.list.map(department => {
                                    return {
                                        value: department._id, text: department.name
                                    }
                                })}
                                onChange={this.handleOrganizationalUnitsChange}
                                multiple={true}
                            />
                        </div>
                        <div className="form-group">
                            <label>{ translate('notification.users') }</label>
                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                id={`notification-to-users`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {user.list.map(user => {
                                    return {
                                        value: user._id, text: user.name
                                    }
                                })}
                                onChange={this.handleUsersChange}
                                multiple={true}
                            />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
         );
    }
}
 
function mapState(state){
    const { department, user, auth } = state ;
    return { department, user, auth };
}
const actions = {
    getDepartment: DepartmentActions.get,
    getUser: UserActions.get,
    create: NotificationActions.create,
}

export default connect( mapState, actions )( withTranslate(NotificationCreate) );