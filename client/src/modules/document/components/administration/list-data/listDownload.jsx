import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../../common-components';

import moment from 'moment'
class ListView extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { translate } = this.props;
        const { downloads } = this.props.docs;
        return (
            <React.Fragment>
                <DialogModal
                    size={50}
                    modalID={`modal-list-download`}
                    title={`${translate('document.downloads')} ${this.props.docs.name}`}
                    hasSaveButton={false}
                    hasNote={false}
                >

                    <div>
                        {downloads && downloads.map(item =>
                            <div key={item._id} className="item-box">
                                <a style={{ fontWeight: 700, cursor: "pointer" }}>{item.downloader?.name} </a>
                                đã download lúc&nbsp;
                                    {moment(item.time).format("HH:mm:ss DD/MM/YYYY")}

                            </div>
                        )}
                    </div>
                </DialogModal>
            </React.Fragment>
        )
    }
}

export default connect(null, null)(withTranslate(ListView));