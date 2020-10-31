import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { NotificationActions } from '../redux/actions';

class NotificationMenu extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            showReceived: false, 
            showSent: false,
            showUnRead: true,
        }
    }
    
    getManualNotifications = async() => {
        await this.props.setLevelNotificationSent();
        await this.props.paginateManualNotifications({
            limit: 10,
            page: 1
        })
    }

    getNotifications = async(unRead) => {
        console.log(unRead);
        if (unRead) {
            await this.props.setLevelNotificationReceivered();
            await this.props.paginateNotifications({
                limit: 10,
                page: 1,
                readed: false,
            })
        } else {
            await this.props.setLevelNotificationReceivered();
            await this.props.paginateNotifications({
                limit: 10,
                page: 1
            })
        }
    }

    showTabReceivered = async() => {
        window.$('#tab-notification-sent').hide();
        window.$('#tab-notification-un-read').hide();
        window.$('#tab-notification-receivered').show();
        this.setState({
            showReceived: true,
            showSent: false,
            showUnRead: false,
        });
        await this.getNotifications(false);
    }

    showTabSent = async() => {
        window.$('#tab-notification-receivered').hide();
        window.$('#tab-notification-un-read').hide();
        window.$('#tab-notification-sent').show();
        this.setState({
            showReceived: false,
            showSent: true,
            showUnRead: false,
        });
        await this.getManualNotifications();
    }

    setLevel = async(level) => {
        const {showReceived, showUnRead} = this.state;
        if(showReceived){
            const {limit} = this.props.notifications.receivered;
            await this.props.setLevelNotificationReceivered(level);
            await this.props.paginateNotifications({ limit, page:1, content: {level} })
        }else{
            if (showUnRead) {
                const {limit} = this.props.notifications.receivered;
                await this.props.setLevelNotificationReceivered(level);
                await this.props.paginateNotifications({ limit, page:1, content: {level}, readed: false })
            } else {
                const {limit} = this.props.notifications.sent;
                await this.props.setLevelNotificationSent(level);
                await this.props.paginateManualNotifications({ limit, page:1, content: {level} })
            }
        }
    }
    showTabUnRead = async() => {
        window.$('#tab-notification-receivered').hide();
        window.$('#tab-notification-sent').hide();
        window.$('#tab-notification-un-read').show();
        this.setState({
            showReceived: false,
            showSent: false,
            showUnRead: true,
        });
        await this.getNotifications(true);
    }

    render() { 
        const { translate, notifications } = this.props;
        const { showReceived, showSent, showUnRead } = this.state;
        const sentLevel = this.props.notifications.sent.level;
        const receiveredLevel = this.props.notifications.receivered.level;

        return ( 
            <React.Fragment>
                <div className="box box-solid"><div className="box-body no-padding">
                        <ul className="nav nav-pills nav-stacked">
                            <li onClick={this.showTabUnRead} className={this.state.showUnRead ? "active-notification-button" : null} ><a href="#abc"><i className="material-icons" style={{marginRight: 3, fontSize: 17, paddingRight: 2}}>notifications_active</i>{translate('notification.unread')}</a></li>
                            <li onClick={this.showTabReceivered} className={this.state.showReceived ? "active-notification-button" : null}><a href="#abc"><i className="fa fa-fw fa-inbox"/>{translate('notification.receivered')}</a></li>
                            {this.checkHasComponent('create-notification') &&
                            <li onClick={this.showTabSent} className={this.state.showSent ? "active-notification-button" : null}><a href="#abc"><i className="fa fa-fw fa-envelope-o"/>{translate('notification.sent')}</a></li> }
                        </ul>
                    </div>
                </div> 
                <div className="box box-solid">
                    <ul className="nav nav-pills nav-stacked">
                        <li onClick={()=>this.setLevel("info")} className={
                            showSent ?
                            (sentLevel === 'info' ? "active-notification-button" : null ):
                            (receiveredLevel === 'info' ? "active-notification-button" : null )
                        }>
                            <a href="#abc" className="text-blue">
                                <i className="fa fa-fw fa-info-circle text-blue" /> 
                                {translate('notification.type.info')}
                            </a>
                        </li>
                        <li onClick={()=>this.setLevel("general")} className={
                            showSent ?
                            (sentLevel === 'general' ? "active-notification-button" : null ):
                            (receiveredLevel === 'general' ? "active-notification-button" : null )
                        }>
                            <a href="#abc" className="text-green">
                                <i className="fa fa-fw fa-bell" /> 
                                {translate('notification.type.general')}
                            </a>
                        </li>
                        <li onClick={()=>this.setLevel("important")} className={
                            showSent ?
                            (sentLevel === 'important' ? "active-notification-button" : null ):
                            (receiveredLevel === 'important' ? "active-notification-button" : null )
                        }>
                            <a href="#abc" className="text-orange">
                                <i className="fa fa-fw fa-warning" /> 
                                {translate('notification.type.important')}
                            </a>
                        </li>
                        <li onClick={()=>this.setLevel("emergency")} className={
                            showSent ?
                            (sentLevel === 'emergency' ? "active-notification-button" : null ):
                            (receiveredLevel === 'emergency' ? "active-notification-button" : null )
                        }>
                            <a href="#abc" className="text-red">
                                <i className="fa fa-fw fa-bomb" /> 
                                {translate('notification.type.emergency')}
                            </a>
                        </li>
                    </ul>
                </div>
            </React.Fragment>
         );
    }

    checkHasComponent = (name) => {
        let { auth } = this.props;
        let result = false;
        auth.components.forEach(component => {
            if(component.name === name) result=true;
        });

        return result;
    }
}
 
function mapState(state){
    const { notifications, auth } = state;
    return { notifications, auth };
}
const action = {
    setLevelNotificationReceivered: NotificationActions.setLevelNotificationReceivered,
    setLevelNotificationSent: NotificationActions.setLevelNotificationSent,
    paginateNotifications: NotificationActions.paginateNotifications,
    paginateManualNotifications: NotificationActions.paginateManualNotifications,
}

export default connect(mapState, action)(withTranslate(NotificationMenu));