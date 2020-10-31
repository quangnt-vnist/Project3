import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { purchasingRequestActions } from '../redux/actions';
import { formatToTimeZoneDate } from '../../../../../helpers/formatDate';
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { generateCode } from '../../../../../helpers/generateCode';

class PurchasingRequestCreateForm extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_GOOD = {
            goodId: "1",
            goodObject: "",
            quantity: ""
        };
        this.state = {
            code: generateCode("PDN"),
            intendReceiveTime: "",
            description: "",
            listGoods: [],
            good: Object.assign({}, this.EMPTY_GOOD),
            editGood: false,
            goodOptions: [],
            // Một phần tử của goodOptions
            indexEditting: ""
        };
    }

    getAllGoods = () => {
        const { translate, goods } = this.props;
        let listGoods = [{
            value: "1",
            text: translate('manufacturing.purchasing_request.choose_material')
        }];
        const { listGoodsByType } = goods;

        if (listGoodsByType) {
            listGoodsByType.map((item) => {
                listGoods.push({
                    value: item._id,
                    text: item.code + " - " + item.name
                })
            })
        }

        return listGoods

    }

    handleClickCreate = () => {
        const value = generateCode("PDN");
        this.setState({
            code: value
        });
    }

    handleIntendReceiveTimeChange = (value) => {
        if (value.length === 0) {
            value = ""
        }
        this.setState({
            intendReceiveTime: value
        })
    }

    handleDescriptionChange = (e) => {
        const { value } = e.target;
        this.validateDescriptionChange(value, true);

    }

    validateDescriptionChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "") {
            msg = translate('manufacturing.purchasing_request.error_description')
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                description: value,
                errorDescription: msg
            }));
        }

        return msg;
    }

    handleGoodChange = (value) => {
        const goodId = value[0];
        this.validateGoodChange(goodId, true);
    }

    validateGoodChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "1") {
            msg = translate('manufacturing.purchasing_request.error_good')
        }

        if (willUpdateState) {
            let { good } = this.state;

            good.goodId = value

            const { goods } = this.props;
            const { listGoodsByType } = goods;
            let goodArrFilter = listGoodsByType.filter(x => x._id === good.goodId);
            if (goodArrFilter) {
                good.goodObject = goodArrFilter[0];
            }


            this.setState((state) => ({
                ...state,
                good: { ...good },
                errorGood: msg
            }))
        }

        console.log(this.state.good);
        return msg;

    }

    handleQuantityChange = (e) => {
        let { value } = e.target;
        this.validateQuantityChange(value, true);
    }

    validateQuantityChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "") {
            msg = translate('manufacturing.purchasing_request.error_quantity')
        }
        if (value < 1) {
            msg = translate('manufacturing.purchasing_request.error_quantity_lt_1')
        }
        if (willUpdateState) {
            let { good } = this.state;
            good.quantity = value;
            this.setState((state) => ({
                ...state,
                good: { ...good },
                errorQuantity: msg
            }));
            console.log(this.state);
        }
        return msg;

    }

    isGoodValidated = () => {
        if (this.validateGoodChange(this.state.good.goodId, false)
            || this.validateQuantityChange(this.state.good.quantity, false)
        ) {
            return false;
        }
        return true
    }

    handleClearGood = async (e) => {
        e.preventDefault();

        await this.setState((state) => {
            return {
                ...state,
                good: Object.assign({}, this.EMPTY_GOOD),
            }
        });
    }

    handleAddGood = (e) => {
        e.preventDefault();
        let { listGoods, good } = this.state;

        // Lấy các thông tin của good đưa vào goodObject va day good vao listGoods
        const { goods } = this.props;
        const { listGoodsByType } = goods;
        let goodArrFilter = listGoodsByType.filter(x => x._id === good.goodId);
        if (goodArrFilter) {
            good.goodObject = goodArrFilter[0];
        }

        listGoods.push(good);

        // filter good ra khoi getAllGoods() va gan state vao goodOption
        let { goodOptions } = this.state;
        if (goodOptions.length === 0) {
            goodOptions = this.getAllGoods().filter(x => x.value !== good.goodId);
        } else {
            // Nếu state đang là goodOptions thi vẫn phải filter những thằng còn lại
            goodOptions = goodOptions.filter(x => x.value !== good.goodId);
            console.log(goodOptions)
        }

        // Cập nhật lại good state

        good = Object.assign({}, this.EMPTY_GOOD);

        this.setState((state) => ({
            ...state,
            listGoods: [...listGoods],
            goodOptions: [...goodOptions],
            good: { ...good }
        }))
    }

    handleDeleteGood = (good, index) => {
        let { listGoods, goodOptions } = this.state;
        // Loại bỏ phần tử good ra khỏi listGoods
        listGoods.splice(index, 1);

        this.setState((state) => ({
            ...state,
            listGoods: [...listGoods],
            goodOptions: [...goodOptions, {
                value: good.goodId,
                text: good.goodObject.code + " - " + good.goodObject.name
            }]
        }));
    }

    handleEditGood = (good, index) => {
        let { goodOptions } = this.state;
        this.setState({
            editGood: true,
            good: { ...good },
            goodOptions: [...goodOptions, {
                value: good.goodId,
                text: good.goodObject.code + " - " + good.goodObject.name
            }],
            indexEditting: index
        });
    }

    handleCancelEditGood = (e) => {
        e.preventDefault();
        let { listGoods, indexEditting, goodOptions } = this.state;
        goodOptions = goodOptions.filter(x => x.value !== listGoods[indexEditting].goodId)
        this.setState({
            editGood: false,
            good: Object.assign({}, this.EMPTY_GOOD),
            goodOptions: goodOptions
        });

    }

    handleSaveEditGood = () => {
        let { listGoods, good, indexEditting, goodOptions } = this.state;
        goodOptions = goodOptions.filter(x => x.value !== good.goodId)
        listGoods[indexEditting] = this.state.good;
        this.setState({
            editGood: false,
            good: Object.assign({}, this.EMPTY_GOOD),
            goodOptions: goodOptions,
            listGoods: [...listGoods]
        })
    }

    isFormValidated = () => {
        if (
            this.validateDescriptionChange(this.state.description, false)
            || this.state.intendReceiveTime === ""
            || this.state.listGoods.length === 0
        ) {
            return false;
        }
        return true;
    }

    save = () => {
        if (this.isFormValidated()) {
            let { listGoods } = this.state;
            let materials = listGoods.map((good) => {
                return {
                    good: good.goodId,
                    quantity: good.quantity
                }
            })
            let intendReceiveTime = formatToTimeZoneDate(this.state.intendReceiveTime)
            const data = {
                code: this.state.code,
                intendReceiveTime: intendReceiveTime,
                description: this.state.description,
                materials: materials
            }
            this.props.createPurchasingRequest(data);
        }
    }

    render() {
        const { translate, purchasingRequest } = this.props;
        const { code, intendReceiveTime, errorIntendReceiveTime, description, errorDescription, good, errorGood, errorQuantity, listGoods, goodOptions } = this.state;
        return (
            <React.Fragment>
                <ButtonModal onButtonCallBack={this.handleClickCreate} modalID="modal-create-purchasing-request" button_name={translate('manufacturing.purchasing_request.add_purchasing_request_button')} title={translate('manufacturing.purchasing_request.add_purchasing_request')} />
                <DialogModal
                    modalID="modal-create-purchasing-request" isLoading={purchasingRequest.isLoading}
                    formID="form-create-purchasing-request"
                    title={translate('manufacturing.purchasing_request.add_purchasing_request')}
                    msg_success={translate('manufacturing.purchasing_request.create_successfully')}
                    msg_faile={translate('manufacturing.purchasing_request.create_failed')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-create-purchasing-request">
                        <div className="form-group">
                            <label>{translate('manufacturing.purchasing_request.code')}<span className="text-red">*</span></label>
                            <input type="text" disabled={true} value={code} className="form-control"></input>
                        </div>
                        {/* <div className="form-group">
                            <label>{translate('manufacturing.purchasing_request.planCode')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div> */}
                        <div className={`form-group ${!errorIntendReceiveTime ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.purchasing_request.receiveTime')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`purchasing-request-create-intendReceiveTime`}
                                value={intendReceiveTime}
                                onChange={this.handleIntendReceiveTimeChange}
                                disabled={false}
                            />
                            <ErrorLabel content={errorIntendReceiveTime} />
                        </div>
                        <div className={`form-group ${!errorDescription ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.purchasing_request.description')}<span className="text-red">*</span></label>
                            <input type="text" value={description} onChange={this.handleDescriptionChange} className="form-control"></input>
                            <ErrorLabel content={errorDescription} />
                        </div>

                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manufacturing.purchasing_request.material_info')}</legend>
                            <div className={`form-group ${!errorGood ? "" : "has-error"}`}>
                                <label>{translate('manufacturing.purchasing_request.material_code')}</label>
                                <SelectBox
                                    id={`select-material-purchasing-request`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={good.goodId}
                                    items={goodOptions.length ? goodOptions : this.getAllGoods()}
                                    onChange={this.handleGoodChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorGood} />
                            </div>

                            <div className={`form-group ${!errorQuantity ? "" : "has-error"}`}>
                                <label className="control-label">{translate('manufacturing.purchasing_request.quantity')}</label>
                                <div>
                                    <input type="number" className="form-control" placeholder={100} value={good.quantity} onChange={this.handleQuantityChange} />
                                </div>
                                <ErrorLabel content={errorQuantity} />
                            </div>
                            <div className="pull-right" style={{ marginBottom: "10px" }}>
                                {this.state.editGood ?
                                    <React.Fragment>
                                        <button className="btn btn-success" onClick={this.handleCancelEditGood} style={{ marginLeft: "10px" }}>{translate('manufacturing.purchasing_request.cancel_editing_good')}</button>
                                        <button className="btn btn-success" disabled={!this.isGoodValidated()} onClick={this.handleSaveEditGood} style={{ marginLeft: "10px" }}>{translate('manufacturing.purchasing_request.save_good')}</button>
                                    </React.Fragment> :
                                    <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isGoodValidated()} onClick={this.handleAddGood}>{translate('manufacturing.purchasing_request.add_good')}</button>
                                }
                                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>{translate('manufacturing.purchasing_request.delete_good')}</button>
                            </div>
                        </fieldset>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>{translate('manufacturing.purchasing_request.index')}</th>
                                    <th>{translate('manufacturing.purchasing_request.good_code')}</th>
                                    <th>{translate('manufacturing.purchasing_request.good_name')}</th>
                                    <th>{translate('manufacturing.purchasing_request.good_base_unit')}</th>
                                    <th>{translate('manufacturing.purchasing_request.quantity')}</th>
                                    <th>{translate('table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (!listGoods || listGoods.length === 0) ?
                                        <tr>
                                            <td colSpan={6}>
                                                <center>{translate('confirm.no_data')}</center>
                                            </td>
                                        </tr>
                                        :
                                        listGoods.map((good, index) => {
                                            return <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{good.goodObject.code}</td>
                                                <td>{good.goodObject.name}</td>
                                                <td>{good.goodObject.baseUnit}</td>
                                                <td>{good.quantity}</td>
                                                <td>
                                                    <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditGood(good, index)}><i className="material-icons"></i></a>
                                                    <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteGood(good, index)}><i className="material-icons"></i></a>
                                                </td>
                                            </tr>
                                        })
                                }
                            </tbody>
                        </table>
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    const { purchasingRequest, goods } = state;
    return { purchasingRequest, goods }
}

const mapDispatchToProps = {
    createPurchasingRequest: purchasingRequestActions.createPurchasingRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PurchasingRequestCreateForm));