import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import './alert.css';

import store from '../../../redux/store';
import { SocketConstants } from '../../socket/redux/constants';

class AuthAlert extends Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }
    reset = () => {
        store.dispatch({ type: SocketConstants.DISCONNECT_SOCKET_IO })
        store.dispatch({ type: 'RESET' });
    }

    render() { 
        const { translate } = this.props;

        return ( 
            <React.Fragment>
                <div className="modal fade" id="alert-error-auth">
                    <div className="modal-dialog" style={{marginTop: '100px'}}>
                        <div className="modal-header bg bg-red" style={{fontSize: '18px'}}>
                            <i className="icon fa fa-bullhorn" />
                            <b> {translate('general.auth_alert.title')}</b>
                        </div>
                        <div className="modal-content">
                            <div className="modal-body">
                                <p><b></b></p>
                                <p>{translate('general.auth_alert.reason')}</p>
                                <ul>
                                    {
                                        translate('general.auth_alert.content').map(content => <li key={content}>{content}</li>)
                                    }
                                </ul>
                                <button className="btn btn-default pull-right" data-dismiss="modal" onClick={this.reset}>{translate('general.accept')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
 
const mapStateToProps = state => {
    return state;
}

export default connect( mapStateToProps )( withTranslate(AuthAlert) );