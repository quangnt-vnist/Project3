import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class FileTabInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        const { files } = this.props;
        const { translate, id } = this.props;
        return (
            <React.Fragment>
                <div id={id} className="tab-pane">
                    <div className="row">
                        <div className="col-md-12">
                            <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                                <thead>
                                    <tr>
                                        <th>{translate('crm.customer.file.name')}</th>
                                        <th>{translate('crm.customer.file.description')}</th>
                                        <th>{translate('crm.customer.file.fileName')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        files && files.length > 0 ? files.map((o, index) => (
                                            <tr className={`item-${index}`} key={index}>
                                                <td>{o.name}</td>
                                                <td>{o.description}</td>
                                                <td><a href={`${o.url}`} target="_blank">{o.fileName}</a></td>
                                            </tr>
                                        )) : null
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(FileTabInfoForm));