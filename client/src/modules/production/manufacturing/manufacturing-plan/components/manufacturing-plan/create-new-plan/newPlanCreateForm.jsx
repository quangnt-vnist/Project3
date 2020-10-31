import React, { Component } from 'react';
import { ButtonModal, DialogModal } from '../../../../../../../common-components';
import CommandCreateForm from './commandCreateForm';
import PlanInfoForm from './generalPlanInfoForm';
import MaterialInfoForm from './materialInfoForm';
import MillScheduleBooking from './millScheduleBooking';
import WorkerBooking from './workerBooking';
import './planCreate.css';



class NewPlanCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            steps: [{
                label: "Thông tin chung",
                active: true
            }, {
                label: "Nguyên vật liệu",
                active: false
            }, {
                label: "Lệnh sản xuất",
                active: false
            }, {
                label: "Ca sản xuất",
                active: false
            }, {
                label: "Nhân công",
                active: false
            }]
        };
    }

    nextStep = async (e) => {
        e.preventDefault();
        await this.setState((state) => ({
            step: state.step + 1
        }));

        let { step, steps } = this.state;
        steps.map((item, index) => {
            if (index <= step) {
                item.active = true;
            } else {
                item.active = false;
            }
            return item;
        });
        await this.setState({
            steps: steps
        })

    }

    prevStep = async (e) => {
        e.preventDefault();
        await this.setState((state) => ({
            step: state.step - 1
        }));

        let { step, steps } = this.state;
        steps.map((item, index) => {
            if (index <= step) {
                item.active = true;
            } else {
                item.active = false;
            }
            return item;
        });
        await this.setState({
            steps: steps
        })
    }
    render() {
        const { step, steps } = this.state;
        console.log(steps);
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-new-plan" button_name="Tạo kế hoạch" title="Tạo kế hoạch sản xuất" />
                <DialogModal
                    modalID="modal-create-new-plan" isLoading={false}
                    formID="form-create-new-plan"
                    title="Tạo kế hoạch sản xuất"
                    // msg_success={translate('manage_plan.add_success')}
                    // msg_faile={translate('manage_plan.add_fail')}
                    // func={this.save}
                    // disableSubmit={!this.isFormValidated()}
                    hasNote={false}
                    size={100}
                    maxWidth={500}
                >
                    <form id="form-create-new-plan">

                        <div className="timeline">
                            <div className="timeline-progress" style={{ width: `${step * 100 / (steps.length - 1)}%` }}></div>
                            <div className="timeline-items">
                                {
                                    steps.map((item, index) => (
                                        <div className={`timeline-item ${item.active ? 'active' : ''}`} key={index}>
                                            <div className="timeline-contain">{item.label}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div>
                            {
                                step === 0 && <PlanInfoForm />
                            }
                            {
                                step === 1 && <MaterialInfoForm />
                            }
                            {
                                step === 2 && <CommandCreateForm />
                            }
                            {
                                step === 3 && <MillScheduleBooking />
                            }
                            {
                                step === 4 && <WorkerBooking />
                            }
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div>
                                {step + 1} / {steps.length}
                            </div>
                            <div>
                                {
                                    step !== 0
                                        ?
                                        <button className="btn" onClick={this.prevStep}>Trước</button>
                                        :
                                        ""
                                }
                                {
                                    " "
                                }
                                {
                                    step === (steps.length - 1)
                                        ?
                                        ""
                                        :
                                        <button className="btn btn-success" onClick={this.nextStep}>Sau</button>
                                }

                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
}

export default NewPlanCreateForm;