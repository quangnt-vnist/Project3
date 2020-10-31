import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../modules/auth/redux/actions';
import { ApiImage, DialogModal, ErrorLabel } from '../../../common-components';
import CropImage from './cropImage';
import './cropImage.css';
import ValidationHelper from '../../../helpers/validationHelper';

class ModalChangeUserInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    showCropImageSpace= () => {
        window.$('#modal-crop-user-image').modal('show');
    }

    getImage = (img) => {
        this.setState({
            img: img
        })
        fetch(img)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], 'avatar.png', blob)
                this.setState({
                    img: img,
                    avatar: file
                })
            })
    }

    render() { 
        const {translate} = this.props;
        const {userAvatar, userName, userEmail, userNameError, userEmailError} = this.state;
        return ( 
            <React.Fragment>
                <DialogModal
                    modalID="modal-profile"
                    formID="form-profile"
                    title={translate('auth.profile.title')}
                    func={this.changeInformation}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-profile">
                        {/* User information */}
                        <div className="row">
                            <div className="col-xs-6 col-sm-4 col-md-4 col-lg-4">
                                <div className="profile-pic">
                                    {
                                        this.state.img === undefined ?
                                        <img className="user-avatar" src={process.env.REACT_APP_SERVER+this.props.auth.user.avatar}/> :
                                        <img className="user-avatar" src={this.state.img}/>
                                    }
                                    <button type="button" className="edit-option" onClick={this.showCropImageSpace}><i className="fa fa-camera" style={{color: 'white'}}></i></button>
                                </div>
                            </div>
                            <div className="col-xs-6 col-sm-8 col-md-8 col-lg-8">
                                <div className={`form-group ${userNameError===undefined?"":"has-error"}`}>
                                    <label>{ translate('auth.profile.name') }<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="name" value={userName} onChange={this.handleChangeName}/>
                                    <ErrorLabel content={userNameError}/>
                                </div>
                                <div className={`form-group ${userEmailError===undefined?"":"has-error"}`}>
                                    <label>{ translate('auth.profile.email') }<span className="text-red">*</span></label>
                                    <input type="email" className="form-control" name="email" onChange={this.handleEmail} value={userEmail}/>
                                    <ErrorLabel content={userEmailError}/>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogModal>
                {/* Crop image */}
                <CropImage getImage={this.getImage}/>
            </React.Fragment>
         );
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.userId !== prevState.userId) {
            return {
                ...prevState,
                userId: nextProps.userId,
                userName: nextProps.userName,
                userEmail: nextProps.userEmail,
                userNameError: undefined,
                userEmailError: undefined
            } 
        } else {
            return null;
        }
    }
      
    changeInformation = async() => {
        const {userName, userEmail} = this.state;
        let formdata = new FormData();
        await formdata.append('avatar', this.state.avatar);
        await formdata.append('name', userName);
        await formdata.append('email', userEmail);

        if(this.isFormValidated()) return this.props.changeInformation(formdata);
            
    }

    handleChangeName = (e) => {
        let {value} = e.target;
        let {translate} = this.props;
        let {message} = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({
            userName: value,
            userNameError: message
        })
    }
    
    handleEmail = (e) => {
        let {value} = e.target;
        let {translate} = this.props;
        let {message} = ValidationHelper.validateEmail(translate, value);
        this.setState({
            userEmail: value,
            userEmailError: message
        })
    }

    
    isFormValidated = () => {
        let {userName, userEmail} = this.state;
        let {translate} = this.props;
        if(
            !ValidationHelper.validateName(translate, userName, 6, 255).status ||
            !ValidationHelper.validateEmail(translate, userEmail).status
        ) return false;
        return true;
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = {
    changeInformation: AuthActions.changeInformation
}
export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(ModalChangeUserInformation) );