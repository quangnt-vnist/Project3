import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import AdministrationDocumentCategories from './categories';
import AdministrationDocumentDomains from './domains';
import AdministrationDocumentListData from './list-data';
import AdministrationStatisticsReport from './statistics-report';
import AdministrationDocumentArchives from './archives';

import { LazyLoadComponent, forceCheckOrVisible } from '../../../../common-components/index';

class ManageDocument extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { translate } = this.props;

        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#administration-document-list-data" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('document.data')}</a></li>
                    <li><a href="#administration-document-categories" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('document.category')}</a></li>
                    <li><a href="#administration-document-domains" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('document.domain')}</a></li>
                    <li><a href="#administration-document-archives" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('document.archive')}</a></li>
                    <li><a href="#administration-statistics-report" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('document.statistics_report')}</a></li>
                </ul>
                <div className="tab-content">

                    {/** Danh sách tài liệu văn bản */}
                    <div className="tab-pane active" id="administration-document-list-data">
                        <LazyLoadComponent
                            key="AdministrationDocumentListData"
                        >
                            <AdministrationDocumentListData />
                        </LazyLoadComponent>
                    </div>

                    {/** Loại văn bản */}
                    <div className="tab-pane" id="administration-document-categories">
                        <LazyLoadComponent
                            key="AdministrationDocumentCategories"
                        >
                            <AdministrationDocumentCategories />
                        </LazyLoadComponent>
                    </div>

                    {/** Danh mục */}
                    <div className="tab-pane" id="administration-document-domains">
                        <LazyLoadComponent
                            key="AdministrationDocumentDomains"
                        >
                            <AdministrationDocumentDomains />
                        </LazyLoadComponent>
                    </div>

                    {/** Thống kê báo cáo */}
                    <div className="tab-pane" id="administration-statistics-report">
                        <LazyLoadComponent
                            key="AdministrationStatisticsReport"
                        >
                            <AdministrationStatisticsReport />
                        </LazyLoadComponent>
                    </div>

                    {/** Lưu trữ */}
                    <div className="tab-pane" id="administration-document-archives">
                        <LazyLoadComponent
                            key="AdministrationDocumentArchives"
                        >
                            <AdministrationDocumentArchives />
                        </LazyLoadComponent>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(withTranslate(ManageDocument));