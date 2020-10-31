import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DeleteNotification, PaginateBar, DateTimeConverter } from '../../../common-components';
import { NotificationActions } from '../redux/actions';
import NotificationSentInfo from './notificationSentInfo';
import parse from 'html-react-parser';
import innerText from 'react-innertext';

class TabNotificationSent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 10,
            page: 1
         }
    }
    render() { 
        const { translate, notifications } = this.props;
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
                    this.state.currentRow &&
                    <NotificationSentInfo
                        notificationId={this.state.currentRow._id}
                        notificationTitle={this.state.currentRow.title}
                        notificationContent={this.state.currentRow.content}
                        notificationLevel={this.state.currentRow.level}
                        notificationSender={this.state.currentRow.sender}
                        notificationReaded={this.state.currentRow.readed}
                        notificationCreatedAt={this.state.currentRow.createdAt}
                        notificationOrganizationalUnits={this.state.currentRow.organizationalUnits}
                        notificationUsers={this.state.currentRow.users}
                    />
                }
                <div id="tab-notification-sent" style={{display: 'none'}}>
                    <ul className="todo-list">
                    {
                        notifications.sent.paginate.length > 0 ? 
                        notifications.sent.paginate.map((notification, index) => 
                            <li key={notification._id}  style={{border: "none", backgroundColor: "white", cursor: "pointer", overflow: "hidden"}}>
                                <div className="row" >
                                    <div style={{ marginBottom: 5 }} className="col-sm-11" onClick={() => this.showNotificationInformation(notification)}>
                                        <div>{
                                            notification.level === 'info' ? <i className="fa fa-fw fa-info-circle text-blue" /> :
                                                notification.level === 'general' ? <i className="fa fa-fw fa-bell text-green" /> :
                                                    notification.level === 'important' ? <i className="fa fa-fw fa-warning text-yellow" /> :
                                                        <i className="fa fa-fw fa-bomb text-red" />
                                        }
                                            <DateTimeConverter dateTime={notification.createdAt} type={1} /></div>
                                        <span className="threedots" style={{ maxWidth: "100%", display: "inline-block" }}><b>{notification.title}</b> {content[index]}</span>
                                    </div>
                                    <div className="col-sm-1">
                                        <DeleteNotification
                                            content={translate('notification.delete')}
                                            data={{ id: notification._id, info: notification.title }}
                                            func={this.props.deleteManualNotification}
                                        />
                                    </div>
                                </div>
                            </li>
                        ): notifications.isLoading ?
                        <div className="table-info-panel" style={{textAlign: "left"}}>{translate('general.loading')}</div>:
                        <div className="table-info-panel" style={{textAlign: "left"}}>{translate('general.no_data')}</div>
                    }
                    </ul>
                    <PaginateBar pageTotal={notifications.sent.totalPages} currentPage={notifications.sent.page} func={this.setPage}/>
                </div>
            </React.Fragment>
         );
    }

    setPage = (pageNumber) => {
        this.setState({ page: pageNumber });
        const data = { limit: this.state.limit, page: pageNumber, content: {level: this.props.notifications.sent.level}};
        this.props.paginateManualNotifications(data);
    }

    showNotificationInformation = async (notification) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: notification
            }
        });
        
        window.$('#modal-notification-sent').modal('show');
    }

    convertContent = (content) => {
        const newContent = content.slice(0,24);
        return newContent.concat(newContent, ' ... ');
    }

    componentDidMount(){
        this.props.getAllManualNotifications();
        this.props.paginateManualNotifications({
            limit: this.state.limit, 
            page: this.state.page,
            content: {level: this.props.notifications.sent.level}
        });
    }
}
 
function mapState(state) {
    const { notifications } = state;
    return { notifications };
}
const actions = {
    getAllManualNotifications: NotificationActions.getAllManualNotifications,
    paginateManualNotifications: NotificationActions.paginateManualNotifications,
    deleteManualNotification: NotificationActions.deleteManualNotification,
}
export default connect(mapState, actions)(withTranslate(TabNotificationSent));