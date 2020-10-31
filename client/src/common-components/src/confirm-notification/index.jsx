import React, { Component } from 'react';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class ConfirmNotification extends Component {
    constructor(props) {
        super(props);
        this.state = { 

        }
    }

    confirmNotify = () => {
        const {icon, content, func} = this.props;
        Swal.fire({
            html: content,
            icon,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: this.props.translate('general.no'),
            confirmButtonText: this.props.translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                func();
            }
        })
    }

    render() { 
        const {className, name, title} = this.props;
        return ( 
            <a 
                href="#confirm-notification"
                className={className}
                title={ title }
                onClick={this.confirmNotify} 
            >
                <i className="material-icons">{name}</i>
            </a>
         );
    }
}
 
const mapState = state => state;
const ConfirmNotificationExport = connect(mapState, null)(withTranslate(ConfirmNotification));

export { ConfirmNotificationExport as ConfirmNotification }
