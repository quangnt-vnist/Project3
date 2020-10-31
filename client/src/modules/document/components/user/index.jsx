import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import UserDocumentsData from './documents';
import DocumentUserHistoryStatistics from './history-statistics';
import DocumentDownloaded from './history-statistics/documentDownloaded';
import DocumentCommon from './history-statistics/documentCommon';
import DocumentNew from './history-statistics/documentNew';

class Document extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const { translate } = this.props;
        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#user-documents" data-toggle="tab">{translate('document.data')}</a></li>
                    <li><a href="#user-document-history-document-downloaded" data-toggle="tab">Những văn bản đã download</a></li>
                    <li><a href="#user-document-history-document-common" data-toggle="tab">Những tài liệu văn bản phổ biến</a></li>
                    <li><a href="#user-document-history-document-new" data-toggle="tab">Tài liệu mới nhất</a></li>
                </ul>
                <div className="tab-content">
                    <div className="tab-pane active" id="user-documents">
                        <UserDocumentsData />
                    </div>
                    <div className="tab-pane" id="user-document-history-document-downloaded">
                        <DocumentDownloaded />
                    </div>
                    <div className="tab-pane" id="user-document-history-document-common">
                        <DocumentCommon />
                    </div>
                    <div className="tab-pane" id="user-document-history-document-new">
                        <DocumentNew />
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(withTranslate(Document));