import React, { Component } from 'react';
import { DatePicker, DialogModal, SelectBox, ButtonModal, SelectMulti } from '../../../../../common-components'

 class ManufacturingOrderCreateForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            description: "",
            stock: "",
            responsible: "",
            goods: [],
            returnRule: "",
            serviceLevelAgreement: "",

            typeOrder: '',
            priority: '',

            goodCode: '',
            goodName: '',
            baseUnit: '',
            goodPrice: '',
            goodTax: '',

            type: "quotation",
            note: '',
            returnRuleOfGood: "",
            serviceLevelAgreementOfGood: "",
            nameOfGood: "", 
            baseUnitOfGood: "",
            priceOfGood: null,
            quantityOfGood: null,
        }
    }

    handleChangeDate = () => {
    }
    
    isGoodsValidated = () => {

    }

    handleCustomerChange = (value) => {
        const customer = [
            { 
                customerCode: 'NVA_1875',
                customerName: 'Công ty XYZ',
                customerAddress: 'Hoàng Mai, Hà Nội',
                customerEmployee: 'Nguyễn Văn A',
                customerPhone: '0937985739'
            },
            { 
                customerCode: 'NVB_1789',
                customerName: 'Công ty ABC',
                customerAddress: 'Bạch Mai, Hà Nội',
                customerEmployee: 'Nguyễn Văn B',
                customerPhone: '0359687930'
            }
        ]
    
        const customerInfo = customer.filter((item) => item.customerCode === value[0])

        this.setState({
            customerCode: customerInfo[0].customerCode,
            customerName: customerInfo[0].customerName,
            customerAddress: customerInfo[0].customerAddress,
            customerPhone: customerInfo[0].customerPhone,
            customerEmployee: customerInfo[0].customerEmployee
        })

    }

    handleGoodCodeChange = (value) => {
        const goods = [
            { 
                goodCode: 'SP_0943',
                goodName: 'Thuốc gà rù',
                baseUnit: 'Hộp',
                goodPrice: '250,000 vnđ',
                goodTax: '25,000 vnđ (10%)',

            },
            { 
                goodCode: 'SP_0349',
                goodName: 'Thuốc trị ghẻ',
                baseUnit: 'kg',
                goodPrice: '100,000 vnđ',
                goodTax: '10,000 vnđ (10%)',
            },
            { 
                goodCode: 'SP_0344',
                goodName: 'Kháng sinh bê con',
                baseUnit: 'Hộp',
                goodPrice: '150,000 vnđ',
                goodTax: '15,000 vnđ (10%)',
            }
        ]
        const goodInfo = goods.filter((item) => item.goodCode === value[0]);
        this.setState({
            goodCode: goodInfo[0].goodCode,
            goodName: goodInfo[0].goodName,
            baseUnit: goodInfo[0].baseUnit,
            goodPrice: goodInfo[0].goodPrice,
            goodTax: goodInfo[0].goodTax
        })
    }

    handleTypeChange = (value) =>{
        this.setState({
            typeOrder: value[0]
        })
    }

    handlePriorityChange = () => {

    }

  render() {
    let {description, note, responsible, goods, returnRule, serviceLevelAgreement, customerCode,
        customerName, customerAddress, customerPhone,customerEmployee,
        returnRuleOfGood, serviceLevelAgreementOfGood, nameOfGood, baseUnitOfGood, priceOfGood, quantityOfGood, priority,
        goodCode, goodName, typeOrder, baseUnit,goodTax
    } = this.state;

    return (
        <React.Fragment>
            <ButtonModal modalID={`modal-create-manufacturing-order`} button_name={'Lên đơn sản xuất'} title={'Thêm mới đơn sản xuất'} />
            <DialogModal
                modalID={`modal-create-manufacturing-order`} isLoading={false}
                formID={`form-create-manufacturing-order`}
                title={'Đơn sản xuất mới'}
                msg_success={'Thêm đơn thành công'}
                msg_faile={'Thêm đơn không thành công'}
                // disableSubmit={!this.isFormValidated()}
                func={this.save}
                size='75'
                style={{backgroundColor: 'green'}}
            >
                <form id={`form-create-manufacturing-order`} >
                    <div className="row row-equal-height" style={{ marginTop: -25 }}>
                        
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ padding: 10 }}>
                            <fieldset className="scheduler-border" style={{borderRadius: '4px'}}>
                                <legend className="scheduler-border">Thông tin chung</legend>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" >
                                    <div className="form-group">
                                        <label>Loại đơn<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-customer-code-quote`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={typeOrder}
                                            items={[
                                                { value: 'Sản xuất theo đơn đề nghị', text: 'Sản xuất theo đơn đề nghị'},
                                                { value: 'Sản xuất theo đơn kinh doanh',text: 'Sản xuất theo đơn kinh doanh'},
                                                { value: 'Sản xuất tồn kho', text: 'Sản xuất tồn kho'}
                                            ]}
                                            onChange={this.handleTypeChange}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group">
                                        <label>Mức độ ưu tiên<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-customer-code-quote`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={priority}
                                            items={[
                                            { value: 'Thấp', text: 'Thấp'},
                                            { value: 'Trung bình', text: 'Trung bình'},
                                            { value: 'Cao',text: 'Cao'},
                                            { value: 'Khẩn cấp',text: 'Khẩn cấp'}
                                            ]}
                                            onChange={this.handlePriorityChange}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" >
                                    <div className="form-group">
                                        <label>Mô tả<span className="attention"> </span></label>
                                        <input type="text" className="form-control" value={description}/>
                                    </div>
                                </div>
                                
                                
                            </fieldset>
                            

                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ padding: 10, height: '100%' }}>
                            <fieldset className="scheduler-border" style={{borderRadius: '4px'}}>
                                    <legend className="scheduler-border">Đơn sản xuất</legend>
                                    <div className="form-group">
                                        <label>Mã đơn<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" value={'MO_3593'}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Hạn hoàn thành dự kiến</label>
                                        <DatePicker
                                            id="incident_after"
                                            // dateFormat={dateFormat}
                                            // value={startValue}
                                            onChange={this.handleChangeDate}
                                            disabled={false}
                                        />
                                    </div>

                                <div className="form-group">
                                    <label>Người tạo<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value={'Phạm Đại Tài'} disabled={true}/>
                                </div>

                            </fieldset>
                        </div>

                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border" style={{ padding: 10 }}>
                                <legend className="scheduler-border">Các mặt hàng</legend>
                            
                            { this.state.typeOrder === 'Sản xuất tồn kho' ? ( <>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4" style={{ padding: 10, height: '100%' }}>
                                    <div className="form-group">
                                        <label>Mã sản phẩm<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-good-code-quote`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={goodCode}
                                            items={[
                                            { value: 'SP_0943', text: 'SP_0943'},
                                            { value: 'SP_0349', text: 'SP_0349'},
                                            { value: 'SP_0344', text: 'SP_0344'}
                                            ]}
                                            onChange={this.handleGoodCodeChange}
                                            multiple={false}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Tên sản phẩm<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-good-name-quote`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={goodName}
                                            items={[
                                            { value: 'Thuốc gà rù', text: 'Thuốc gà rù'},
                                            { value: 'Thuốc trị ghẻ', text: 'Thuốc trị ghẻ'},
                                            { value: 'Kháng sinh bê con', text: 'Kháng sinh bê con'}
                                            ]}
                                            // onChange={this.handleGoodCodeChange}
                                            multiple={false}
                                        />
                                    </div>
                                    
                                </div>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4" style={{ padding: 10, height: '100%' }}>
                                    <div className="form-group">
                                        <label>Đơn vị tính<span className="attention"> * </span></label>
                                        <SelectBox
                                            id={`select-good-name-quote`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={baseUnit}
                                            items={[
                                            { value: 'Gói', text: 'Gói'},
                                            { value: 'Hộp', text: 'Hộp'},
                                            { value: 'Thùng', text: 'Thùng'}
                                            ]}
                                            // onChange={this.handleGoodCodeChange}
                                            multiple={false}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Số lượng còn trong kho<span className="attention"> * </span></label>
                                        <input type="text" className="form-control"  value={'30 ' + baseUnit} disabled={true}/>
                                    </div>

                                    
                                </div>

                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4" style={{ padding: 10, height: '100%' }}>
                                    <div className="form-group">
                                        <label>Số lượng<span className="attention"> * </span></label>
                                        <input type="number" className="form-control"/>
                                    </div>

                                    <div className="form-group">
                                        <label>Ghi chú<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" value={``} />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className={"pull-right"} style={{ padding: 10 }}>
                                        <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isGoodsValidated()} onClick={this.handleAddGood} >Thêm mới</button>
                                        <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>Xóa trắng</button>
                                    </div>
                                </div>
                                </> ) : (
                                    <div className="form-group">
                                    <label>Chọn đơn<span className="attention"> * </span></label>
                                    <SelectMulti
                                        id={`select-multi-stock-issue`}
                                        multiple="multiple"
                                        options={{ nonSelectedText: "Chọn các đơn", allSelectedText: "Đã chọn hết" }}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={[
                                            { value: '1', text: "Đơn hàng A"},
                                            { value: '2', text: "Đơn hàng B"},
                                            { value: '3', text: "Đơn hàng C"}
                                        ]}
                                        onChange={this.handleChangeOrder}
                                    />
                                </div>
                                ) }
                            
                            {/* Hiển thị bảng */}
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th title={'STT'}>STT</th>
                                        <th title={'Mã sản phẩm'}>Mã sản phẩm</th>
                                        <th title={'Tên sản phẩm'}>Tên sản phẩm</th>
                                        <th title={'Đơn vị tính'}>Đ/v tính</th>
                                        <th title={'Số lượng'}>Số lượng</th>
                                        <th title={'Ghi chú'}>Ghi chú</th>
                                        <th title={'Hành động'}>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody id={`good-edit-manage-by-stock`}>
                                    <tr>
                                        <td>1</td>
                                        <td>SP_0395</td>
                                        <td>Thuốc úm gà</td>
                                        <td>Hộp</td>
                                        <td>10</td>
                                        <td></td>
                                        <td>
                                        <a className="edit text-yellow">
                                            <i className="material-icons">edit</i>
                                        </a>
                                        <a className="edit text-red">
                                            <i className="material-icons">delete</i>
                                        </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            </fieldset>
                        </div>


                    </div>
                </form>
                </DialogModal>
        </React.Fragment>
    );
  }
}


export default ManufacturingOrderCreateForm;