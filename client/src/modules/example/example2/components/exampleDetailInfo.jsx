import React, { Component } from 'react';
import { connect } from 'react-redux';
import { exampleActions } from '../redux/actions';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal } from '../../../../common-components';

class ExampleDetailInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.exampleId !== this.props.exampleId) {
            this.props.getExampleDetail(nextProps.exampleId);
            return false;
        }
        return true;
    }

    render() {
        const { translate, example } = this.props;
        let currentDetailExample = {};
        console.log(example.currentDetailExample);
        if (example.currentDetailExample) {
            currentDetailExample = example.currentDetailExample;
        }
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-detail-info-example`} isLoading={example.isLoading}
                    title={translate('manage_example.detail_info_example')}
                    formID={`form-detail-example`}
                    size={50}
                    maxWidth={500}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form id={`form-detail-example`}>
                        <div className={`form-group`}>
                            <label>{translate('manage_example.exampleName')}</label>
                            <p>{currentDetailExample.exampleName}</p>
                        </div>
                        <div className={`form-group`}>
                            <label>{translate('manage_example.description')}</label>
                            <p>{currentDetailExample.description}</p>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const example = state.example2;
    return { example };
}

const mapDispatchToProps = {
    getExampleDetail: exampleActions.getExampleDetail
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ExampleDetailInfo));