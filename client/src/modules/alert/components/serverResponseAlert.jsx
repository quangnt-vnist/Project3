import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class ServerResponseAlert extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    checkTranslateExist = (code) => {
        const { translate } = this.props;
        const subCode = code.split('.');

        if (subCode.length === 1) {
            return translate(code) ? true : false;
        } else if (subCode.length > 1) {
            let codeData = subCode[0];

            if (!translate(codeData)) {
                return false;
            } else {
                for (let i = 1; i < subCode.length; i++) {
                    codeData = codeData + '.' + subCode[i];

                    if (!translate(codeData)) {
                        return false;
                    }
                }
            }

            return true;
        }
    }

    render() {
        const { translate } = this.props;
        const { type = null, title = null, content = [] } = this.props;

        return (
            <React.Fragment>
                <div className="notification-title"><i></i> {translate(title)}</div>
                {
                    content.map((message, i) => {
                        return this.checkTranslateExist(message) ?
                            <p key={message}>{content.length > 1 ? `${i + 1}. ` : null}{translate(message)}</p> :
                            <p key={message}>{content.length > 1 ? `${i + 1}. ` : null}{message}</p>;
                    })
                }
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(ServerResponseAlert));
