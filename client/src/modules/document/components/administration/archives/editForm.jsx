import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ErrorLabel, TreeSelect } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import ValidationHelper from '../../../../../helpers/validationHelper';

class EditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleName = (e) => {
        const {value} = e.target;
        const {translate} = this.props;
        const {message} = ValidationHelper.validateName(translate, value, 1, 255);
        this.setState({
            name: value,
            nameError: message
        });
    }

    handleDescription = (e) => {
        const {value} = e.target;
        this.setState({
            description: value
        });
    }

    handleParent = (value) => {
        this.setState({ archiveParent: value[0] });
    };

    isValidateForm = () => {
        let {name, description} = this.state;
        let {translate} = this.props;
        if(
            !ValidationHelper.validateName(translate, name, 1, 255).status
        ) return false;
        return true;
    }

    findNode = (element, id) => {
        if (element.id === id) {
            return element
        }
        else if (element.children) {
            let i;
            let result = "";
            for (i = 0; i < element.children.length; i++) {
                result = this.findNode(element.children[i], id);
            }
            return result;
        }
        return null;
    }
    // tìm các node con cháu
    findChildrenNode = (list, node) => {
        let array = [];
        let queue_children = [node];
        while (queue_children.length > 0) {
            let tmp = queue_children.shift();
            array = [...array, tmp._id];
            let children = list.filter(child => child.parent === tmp._id);
            queue_children = queue_children.concat(children);
        }
        return array;
    }

    save = () => {
        const { documents } = this.props;
        const { archiveId, name, description, archiveParent } = this.state;
        const { list } = documents.administration.archives;

        let node = "";
        node = list.filter(archive => archive._id === archiveId)[0]

        // find node child 
        let array = [];
        if (node) {
            array = this.findChildrenNode(list, node);
        }

        this.props.editDocumentArchive(archiveId, {
            name,
            description,
            parent: archiveParent,
            array: array,
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.archiveId !== prevState.archiveId) {
            return {
                ...prevState,
                archiveId: nextProps.archiveId,
                name: nextProps.archiveName,
                description: nextProps.archiveDescription,
                archiveParent: nextProps.archiveParent,
                path: nextProps.archivePath,
                nameError: undefined,
                descriptionError: undefined
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, documents, unChooseNode } = this.props;
        const { list } = documents.administration.archives;
        const { name, description, archiveParent, path, nameError } = this.state;
        let listArchive = [];
        for (let i in list) {
            if (!unChooseNode.includes(list[i].id)) {
                listArchive.push(list[i]);
            }
        }
        const disabled = !this.isValidateForm();
        return (
            <div id="edit-document-archive">
                <div className={`form-group ${nameError === undefined ? "" : "has-error"}`}>
                    <label>{translate('document.administration.archives.name')}<span className="text-red">*</span></label>
                    <input type="text" className="form-control" onChange={this.handleName} value={name} />
                    <ErrorLabel content={nameError} />
                </div>
                <div className="form-group">
                    <label>{translate('document.administration.archives.parent')}</label>
                    <TreeSelect data={listArchive} value={[archiveParent]} handleChange={this.handleParent} mode="radioSelect" />
                </div>
                <div className="form-group">
                    <strong>{translate('document.administration.archives.path_detail')}&emsp; </strong>
                    {path}
                </div>
                <div className="form-group">
                    <label>{translate('document.administration.domains.description')}</label>
                    <textarea style={{ minHeight: '120px' }} type="text" className="form-control" onChange={this.handleDescription} value={description} />
                </div>
                <div className="form-group">
                    <button className="btn btn-success pull-right" style={{ marginLeft: '5px' }} disabled={disabled} onClick={this.save}>{translate('form.save')}</button>
                    <button className="btn btn-danger" onClick={() => {
                        window.$(`#edit-document-archive`).slideUp()
                    }}>{translate('form.close')}</button>
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => state;

const mapDispatchToProps = {
    editDocumentArchive: DocumentActions.editDocumentArchive,
    getDocumentArchives: DocumentActions.getDocumentArchive,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm));