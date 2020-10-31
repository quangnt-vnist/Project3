import React, { Component } from 'react';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class DeleteNotification extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
        this.notification = this.notification.bind(this);
    }

    notification = (
        content, //json - tiêu đề, tên các button
        data, //thông tin về đối tượng
        func //hàm thực hiện tương ứng
    ) => {
        Swal.fire({
            html: `<h4 style="color: red"><div>${content}</div> <div>"${data.info}" ?</div></h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: this.props.translate('general.no'),
            confirmButtonText: this.props.translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                func(data.id);
            }
        })
    }

    render() { 
        const { content, data, func } = this.props;
        return ( 
            <a 
                href="#delete"
                className="delete text-red" 
                title={ content }
                onClick={() => this.notification(
                    content,
                    data,
                    func
                )} 
            >
                <i className="material-icons">delete</i>
            </a>
         );
    }
}
 
const mapState = state => state;
const DeleteNotificationExport = connect(mapState, null)(withTranslate(DeleteNotification));

export { DeleteNotificationExport as DeleteNotification }
