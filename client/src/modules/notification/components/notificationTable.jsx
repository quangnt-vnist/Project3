import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import TabNotificationSent from './tabNotificationSent';
import TabNotificationReceivered from './tabNotificationReceivered';
import TabNotificationUnRead from './tabNotificationUnRead';

class NotificationTable extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() { 
        
        return ( 
            <React.Fragment>
                <div className="" role="tabpanel">
                    <div className="tab-content">
                        <TabNotificationReceivered/>
                        { 
                            this.checkHasComponent('create-notification') && <TabNotificationSent/>
                        }
                        <TabNotificationUnRead/>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    checkHasComponent = (name) => {
        let {auth} = this.props;
        let result = false;
        auth.components.forEach(component => {
            if(component.name === name) result=true;
        });

        return result;
    }
}

function mapState(state) {
    const { auth } = state;
    return { auth};
}
export default connect(mapState)(withTranslate(NotificationTable));