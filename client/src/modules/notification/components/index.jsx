import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import NotificationTable from './notificationTable';
import NotificationMenu from './notificationMenu';
import NotificationCreate from './notificationCreate';

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    checkHasComponent = (name) => {
        let { auth } = this.props;
        let result = false;
        auth.components.forEach(component => {
            if(component.name === name) result=true;
        });

        return result;
    }

    render() { 
        const { translate } = this.props;
        return ( 
            <React.Fragment>
                
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        {
                            this.checkHasComponent('create-notification') &&
                            <NotificationCreate/>
                        }
                        <NotificationMenu />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9">
                        <NotificationTable/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


const mapState = state => state;
const NotificationExport = connect(mapState, null)(withTranslate(Notifications));
export { NotificationExport as Notifications }