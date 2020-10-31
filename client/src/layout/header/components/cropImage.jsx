import React, { Component } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './cropImage.css';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class CropImage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            src: null,
            crop: {
                unit: '%',
                width: 50,
                aspect: 4 / 4,
            }, }
    }
    
    onSelectFile = e => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
        const reader = new FileReader();
        reader.addEventListener('load', () =>
            this.setState({ src: reader.result })
        );
        reader.readAsDataURL(e.target.files[0]);
        }
    };

    // If you setState the crop in here you should return false.
    onImageLoaded = image => {
        this.imageRef = image;
    };

    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };

    onCropChange = (crop, percentCrop) => {
        this.setState({ crop });
    };

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
        const croppedImageUrl = await this.getCroppedImg(
            this.imageRef,
            crop,
            'newFile.jpeg'
        );
        this.setState({ croppedImageUrl });
        this.props.getImage(croppedImageUrl);
        }
    }

    saveCropImage = () => {
        if(this.state.croppedImageUrl !== undefined)
            this.props.getImage(this.state.croppedImageUrl);
        window.$('#modal-crop-user-image').modal('hide');
    }

    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
        );

        return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) {
            //reject(new Error('Canvas is empty'));
            console.error('Canvas is empty');
            return;
            }
            blob.name = fileName;
            window.URL.revokeObjectURL(this.fileUrl);
            this.fileUrl = window.URL.createObjectURL(blob);
            resolve(this.fileUrl);
        }, 'image/jpeg');
        });
    }

    render() {
        const { crop, croppedImageUrl, src } = this.state;
        const {translate} = this.props;
        return (
            <div className="modal fade" id="modal-crop-user-image">
                <div className="modal-dialog crop-image-modal">
                    <div className="modal-content crop-content">
                        <div className="box-header">
                            <div className="upload btn btn-success pull-left">
                                <i className="fa fa-image"></i>
                                {" "+translate('general.pick_image')}
                                <input className="upload" type="file" name="file" onChange={this.onSelectFile} />
                            </div>
                            {src && <button className="btn btn-default pull-right" onClick={this.saveCropImage}><i className="fa fa-crop"></i> {translate('general.crop')}</button>}
                        </div>
                        {src &&
                            <div className="box-body">
                                <div className="row">
                                    <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3" style={{padding: '10px'}}>
                                        <img src={croppedImageUrl} style={{width: '100%', padding: '10px'}}/>
                                    </div>
                                    <div className="col-xs-12 col-sm-9 col-md-9 col-lg-9">
                                        <ReactCrop
                                            src={src}
                                            crop={crop}
                                            ruleOfThirds
                                            onImageLoaded={this.onImageLoaded}
                                            onComplete={this.onCropComplete}
                                            onChange={this.onCropChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            
        );
    }
}
 
const mapStateToProps = state => state;
export default connect(mapStateToProps)(withTranslate(CropImage));