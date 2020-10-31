import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DeleteNotification, PaginateBar, DateTimeConverter } from '../../../common-components';
import { NotificationActions } from '../redux/actions';
import NotificationReceiveredInfo from './notificationReiceiveredInfo';
import parse from 'html-react-parser';
import innerText from 'react-innertext';
class TabNotificationUnRead extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 10, page: 1
        }
    }
    render() { 
        const { translate, notifications } = this.props;
        const { currentRow } = this.state;
        let content = [];
        if (notifications.isLoading === false) {
            content = notifications.receivered.paginate.map( x => x.content);
            content = content.map(x => {
                let y = x.split('');
                let i = 0;
                while ( i < y.length ) {
                    if (y[i] === '&'){
                        y.splice(i,6);
                        i=i-2;
                    }
                    i++;
                }
                i = 1;
                while ( i < y.length ) {
                    if (y[i] === ' ' && y[i-1] === ' '){
                        y.splice(i,1);
                        i=i-1;
                    }
                    i++;
                }
                y = y.join('');
                return innerText(parse(y));
            });
        }
        
        return ( 
            <React.Fragment>
                {
                    currentRow &&
                    <NotificationReceiveredInfo
                        notificationId={currentRow._id}
                        notificationTitle={currentRow.title}
                        notificationContent={currentRow.content}
                        notificationLevel={currentRow.level}
                        notificationSender={currentRow.sender}
                        notificationReaded={currentRow.readed}
                        notificationCreatedAt={currentRow.createdAt}
                    />
                }
                <div id="tab-notification-un-read" style={{display: 'block'}}>
                    <ul className="todo-list">
                    {
                        notifications.receivered.paginate.length > 0 ? 
                        notifications.receivered.paginate.map((notification, index) => 
                            <li key={notification._id} style={{border: "none", backgroundColor: "white", cursor: "pointer", overflow: "hidden"}}>
                                <div className="row" >
                                    <div style={{ marginBottom: 5 }} className="col-sm-11" onClick={() => this.handleEdit(notification)}>
                                        <div>{
                                            notification.level === 'info' ? <i className="fa fa-fw fa-info-circle text-blue" /> :
                                            notification.level === 'general' ? <i className="fa fa-fw fa-bell text-green" /> :
                                            notification.level === 'important' ? <i className="fa fa-fw fa-warning text-yellow" /> :
                                            <i className="fa fa-fw fa-bomb text-red" />
                                        }
                                        <DateTimeConverter dateTime={notification.createdAt} type={1} />
                                            {notification.readed ?
                                                <div className="label" style={{ width: 30, display: "inline-block", margin: "0 0 0 5px" }}></div> :
                                                <div className="label label-danger" style={{ width: 30, display: "inline-block", margin: "0 0 0 5px" }}>{translate('notification.new')}</div>
                                            }</div>
                                        <span className="threedots" style={{ maxWidth: "100%", display: "inline-block" }}><b>{notification.title}</b> {content[index]}</span>
                                    </div>
                                    <div className="col-sm-1">
                                        <DeleteNotification
                                            content={translate('notification.delete')}
                                            data={{ id: notification._id, info: notification.title }}
                                            func={this.props.deleteNotification}
                                        />

                                    </div>
                                </div>
                            </li>
                        ): notifications.isLoading ?
                        <div className="table-info-panel" style={{textAlign: "left"}}>{translate('general.loading')}</div>:
                        <div className="table-info-panel" style={{textAlign: "left"}}>{translate('general.no_data')}</div>
                    }
                    </ul>
                    <div style={{marginTop: 10}}><a style={{cursor: "pointer"}} onClick={() => this.handleClick()}>{translate('notification.mark_all_readed')}</a></div>
                    <PaginateBar id="un-read" pageTotal={notifications.receivered.totalPages} currentPage={notifications.receivered.page} func={this.setPage}/>
                </div>
            </React.Fragment>
         );
    }

    setPage = (pageNumber) => {
        this.setState({ page: pageNumber });
        const data = { limit: this.state.limit, page: pageNumber, content: {level: this.props.notifications.receivered.level}, readed: false };
        this.props.paginateNotifications(data);
    }

    handleEdit = async (notification) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: notification
            }
        });
        !notification.readed && await this.props.readedNotification({ id: notification._id, readAll: false })
        window.$('#modal-notification-receivered').modal('show');
    }

    convertContent = (content) => {
        const newContent = content.slice(0,24);
        return newContent.concat(newContent, ' ... ');
    }

    componentDidMount(){
        this.props.getAllNotifications();
        this.props.paginateNotifications({
            limit: this.state.limit, page: this.state.page,
            content: {level: this.props.notifications.receivered.level, readed: false}
        });
    }

    handleClick = async() =>{
        await this.props.readedNotification({ id: null, readAll: true })
    }
}
 
function mapState(state) {
    const { notifications } = state ;
    return { notifications };
}
const actions = {
    getAllNotifications: NotificationActions.getAllNotifications,
    paginateNotifications: NotificationActions.paginateNotifications,
    deleteNotification: NotificationActions.deleteNotification,
    readedNotification: NotificationActions.readedNotification,
}
export default connect(mapState, actions)(withTranslate(TabNotificationUnRead));