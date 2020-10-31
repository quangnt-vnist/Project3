import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, DateTimeConverter } from '../../../common-components';
import parse from 'html-react-parser';

class NotificationSentInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.notificationId !== prevState.notificationId) {
            return {
                ...prevState,
                notificationId: nextProps.notificationId,
                notificationTitle: nextProps.notificationTitle,
                notificationLevel: nextProps.notificationLevel,
                notificationContent: nextProps.notificationContent,
                notificationSender: nextProps.notificationSender,
                notificationCreatedAt: nextProps.notificationCreatedAt,
                notificationOrganizationalUnits: nextProps.notificationOrganizationalUnits,
                notificationUsers: nextProps.notificationUsers
            }
        } else {
            return null;
        }
    }

    render() { 
        const { notifications, translate } = this.props;
        const { notificationTitle, notificationLevel, notificationContent, notificationSender, notificationCreatedAt, notificationUsers, notificationOrganizationalUnits } = this.state;
        let content = notificationContent;
        let cssTable = " style=\"border: 1px solid black; padding-left: 3px; padding-right: 3px\"";
        while (content.indexOf("<table>") !== -1) {
            let vt = content.indexOf("<table>");
            let str = content.slice(0,vt+6);
            let strEnd = content.slice(vt+6);
            str = str.concat(cssTable);
            str = str.concat(strEnd);
            content = str;
        }
        while (content.indexOf("<td>") !== -1) {
            let vt = content.indexOf("<td>");
            let str = content.slice(0,vt+3);
            let strEnd = content.slice(vt+3);
            str = str.concat(cssTable);
            str = str.concat(strEnd);
            content = str;
        }
        return ( 
            <DialogModal
                func={this.save} isLoading={notifications.isLoading}
                modalID='modal-notification-sent'
                title={notificationTitle}
                hasSaveButton={false} hasNote={false}
            >
                <div className="qlcv">
                    <div className="form-inline">
                        {
                        notificationLevel === 'info' ? <i className="fa fa-fw fa-info-circle text-blue"></i> :
                        notificationLevel === 'general' ? <i className="fa fa-fw fa-bell text-green"></i> :
                        notificationLevel === 'important' === 3 ? <i className="fa fa-fw fa-warning text-orange"></i> :
                        <i className="fa fa-fw fa-bomb text-orange"></i> 
                        }
                        <div className="form-group">
                            <div className="inline">{translate('notification.from')}</div>
                            <div className="inline"><b> {notificationSender}, <DateTimeConverter dateTime={notificationCreatedAt}/></b></div>
                        </div>
                    </div>
                    <div style={{margin: '20px 0px 20px 0px'}}>{parse(content)}</div>
                    {
                        notificationOrganizationalUnits && notificationOrganizationalUnits.length > 0 &&
                        <React.Fragment>
                            <p><b>{translate('notification.departments')}</b></p>
                            <ul>{
                                notificationOrganizationalUnits.map(organizationalUnit=><li key={organizationalUnit._id}>{organizationalUnit.name}</li>)
                            }</ul>
                        </React.Fragment>
                    }
                    {
                        notificationUsers && notificationUsers.length > 0 &&
                        <React.Fragment>
                            <p><b>{translate('notification.users')}</b></p>
                            <ul>{
                                    
                                notificationUsers.map(user=><li key={user._id}>{user.name}</li>)
                            }</ul>
                        </React.Fragment>
                    }
                </div>
            </DialogModal>
         );
    }
}
 
function mapState(state){
    const { notifications } = state;
    return {  notifications };
}
const actions = {
}
export default connect(mapState, actions)(withTranslate(NotificationSentInfo));