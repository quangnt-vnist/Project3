import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { NotificationActions } from '../../../modules/notification/redux/actions';

class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            notify: []
         }
    }

    componentWillUnmount(){
        this.props.socket.io.off('new notifications');
    }

    componentDidMount(){
        this.props.getAllManualNotifications();
        this.props.getAllNotifications();
        this.props.socket.io.on('new notifications', data => {
            this.props.receiveNofitication(data);
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const list = nextProps.notifications.receivered.list.filter(notification => !notification.readed);
        if(JSON.stringify(list) !== JSON.stringify(prevState.notify)){
            return {
                ...prevState,
                notify: list
            }
        }else{
            return null;
        }
    }

    render() { 
        const {translate} = this.props;
        const {notify} = this.state;
        const count = notify.length;

        return ( 
            <React.Fragment>
                <li className="dropdown notifications-menu">
                    <a href="#abc" className="dropdown-toggle" data-toggle="dropdown">
                        <i className="fa fa-bell-o" />
                        {
                            count > 0 && <span className="label label-warning">{count}</span>
                        }
                    </a>
                    <ul className="dropdown-menu" style={{borderColor: 'gray'}}>
                        <li className="header text-center"><strong className="text-red">{notify.filter(notification => !notification.readed).length}</strong> {translate('notification.news')}</li>
                        <li>
                            <ul className="menu">
                                {
                                    notify.filter(notification => !notification.readed).map((notification, index) => {
                                        return <li key={index}>
                                            <Link to="/notifications">  
                                                {
                                                    notification.level === 'info' ? <i className="fa fa-info-circle text-blue"/> :
                                                    notification.level === 'general' ? <i className="fa fa-bell text-green" /> :
                                                    notification.level === 'important' ? <i className="fa fa-warning text-yellow" /> :
                                                    <i className="fa fa-bomb text-red" />
                                                }
                                                {notification.title}
                                            </Link>
                                        </li>
                                    })
                                }
                            </ul>
                        </li>
                        <li className="footer"><Link to="/notifications">{translate('notification.see_all')}</Link></li>
                    </ul>
                </li>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = { 
    getAllManualNotifications: NotificationActions.getAllManualNotifications,
    getAllNotifications: NotificationActions.getAllNotifications,
    receiveNofitication: NotificationActions.receiveNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Notification));