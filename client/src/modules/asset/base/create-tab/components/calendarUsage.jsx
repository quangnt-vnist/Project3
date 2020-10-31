import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RecommendDistributeActions } from '../../../user/use-request/redux/actions';
import { UseRequestActions } from '../../../admin/use-request/redux/actions'
import { UsageLogAddModal, UsageLogDetailModal } from './combinedContent';
import { Scheduler, formatDate } from '../../../../../common-components';
import { UseRequestCreateForm } from './../../../user/use-request/components/UseRequestCreateForm';
import { UseRequestDetailForm } from './../../../user/use-request/components/UseRequestDetailForm';
import './calendarUsage.css';



class CalendarUsage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem('userId'),
      weekendsVisible: true,
      currentEvents: [],
      nowDate: new Date(),
      data: [],
      dataStatus: 1
    }
  }

  componentDidMount() {
    this.props.getRecommendDistributeByAsset(this.props.assetId); // Lấy phiếu đăng ký sử dụng theo tài sản
  }

  shouldComponentUpdate = async (nextProps, nextState) => {
    if (nextState.clickInfo !== this.state.clickInfo || nextState.currentEvent !== this.state.currentEvent) {
      // bắt sự kiện bấm nút phê duyệt, không phê duyệt, xóa
      await this.setState({
        clickInfo: nextState.clickInfo,
        currentEvent: nextState.currentEvent,
      });
      this.handleClick();
      return false;
    }
    if (nextProps.recommendDistribute && nextProps.recommendDistribute.listRecommendDistributesByAsset && this.state.dataStatus == 1) {
      if (this.state.dataStatus === 1) {
        let listRecommendDistributes = nextProps.recommendDistribute.listRecommendDistributesByAsset
        let data = this.state.data
        let RecommendDistributesByAsset = [];
        for (let i in listRecommendDistributes) {
          let recommendDistribute;
          let check = data.filter(item => item.id == listRecommendDistributes[i]._id)
          if ((listRecommendDistributes[i].status == "waiting_for_approval" || listRecommendDistributes[i].status == "disapproved") && !check.length) {
            recommendDistribute = {
              id: listRecommendDistributes[i]._id,
              color: listRecommendDistributes[i].status == "waiting_for_approval" ? '#aaa' : (listRecommendDistributes[i].status == "approved" ? '#337ab7' : '#dd4b39'),
              title: listRecommendDistributes[i].proponent.name,
              start: new Date(listRecommendDistributes[i].dateStartUse),
              end: new Date(listRecommendDistributes[i].dateEndUse),
            }
            RecommendDistributesByAsset.push(recommendDistribute);
          }
        }
        await this.setState(state => {
          return {
            ...state,
            data: [...state.data, ...RecommendDistributesByAsset],
            dataStatus: 2,
          }
        })
      }

      return false;
    }

    // thêm người sử dụng khi load xong createUsage để lấy id cho event
    if (nextState.createUsage && nextProps.assetsManager && nextProps.assetsManager.currentAsset) {
      let length = nextProps.assetsManager.currentAsset.usageLogs.length;
      let userlist = this.props.user.list, departmentlist = this.props.department.list;
      let newUsage = nextProps.assetsManager.currentAsset.usageLogs[length - 1];
      let title;
      await this.setState({
        ...this.state,
        createUsage: false
      })
      let calendarApi = this.state.currentRow.view.calendar;
      if (newUsage.usedByUser && newUsage.usedByOrganizationalUnit) {
        let usedByUser = userlist.filter(item => item._id === newUsage.usedByUser).pop() ? userlist.filter(item => item._id === newUsage.usedByUser).pop().name : "Chưa có đối tượng sử dụng"
        let usedByOrganizationalUnit = departmentlist.filter(item => item._id === newUsage.usedByOrganizationalUnit).pop() ? departmentlist.filter(item => item._id === newUsage.usedByOrganizationalUnit).pop().name : "Chưa có đối tượng sử dụng"
        title = usedByUser + ', ' + usedByOrganizationalUnit
      } else if (newUsage.usedByUser && !newUsage.usedByOrganizationalUnit) {
        title = userlist.filter(item => item._id === newUsage.usedByUser).pop() ? userlist.filter(item => item._id === newUsage.usedByUser).pop().name : "Chưa có đối tượng sử dụng"
      } else if (!newUsage.usedByUser && newUsage.usedByOrganizationalUnit) {
        title = departmentlist.filter(item => item._id === newUsage.usedByOrganizationalUnit).pop() ? departmentlist.filter(item => item._id === newUsage.usedByOrganizationalUnit).pop().name : "Chưa có đối tượng sử dụng"
      }

      calendarApi.unselect()
      calendarApi.addEvent({
        id: newUsage._id,
        title: title,
        color: '#337ab7',
        start: newUsage.startDate,
        end: newUsage.endDate,
      })
    }

    // thay đổi id của event khi bấm phê duyệt từ id của phiếu đăng ký sử dụng sang id của usage mới được thêm
    if (nextState.approved && nextProps.assetsManager && nextProps.assetsManager.currentAsset) {
      let length = nextProps.assetsManager.currentAsset.usageLogs.length;
      let newUsage = nextProps.assetsManager.currentAsset.usageLogs[length - 1];
      let clickInfo = this.state.clickInfo
      await this.setState({
        ...this.state,
        approved: false
      })
      clickInfo.event.setProp("backgroundColor", "#337ab7")
      clickInfo.event.setProp("borderColor", "#337ab7")
      clickInfo.event.setProp("id", newUsage._id)
    }
    return true;
  }

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible
    })
  }

  handleDateSelect = async (selectInfo) => {
    // Reset lại dữ liệu của currentRow
    await this.setState(state => {
      return {
        ...state,
        currentRow: undefined,
        currentRowAdd: undefined
      }
    });
    let startTime = [selectInfo.start.getHours(), selectInfo.start.getMinutes()].join(':');
    let stopTime = [selectInfo.end.getHours(), selectInfo.end.getMinutes()].join(':');

    if (this.props.managedBy == this.state.userId) {
      await this.setState(state => {
        return {
          ...state,
          currentRow: {
            ...selectInfo,
            startTime: startTime,
            stopTime: stopTime,
          }
        }
      });

      window.$(`#modal-create-usage-calendar-${this.props.assetId}`).modal('show');
    } else {
      await this.setState(state => {
        return {
          ...state,
          currentRowAdd: {
            ...selectInfo,
            startTime: startTime,
            stopTime: stopTime,
          }
        }
      });

      window.$(`#modal-create-recommenddistribute-calendar-${this.props.assetId}`).modal('show');
    }

  }

  handleEventClick = async (clickInfo) => {
    await this.setState({
      clickInfo: clickInfo
    })

  }

  handleClick = () => {
    if (this.state.currentEvent == 'delete') {
      this.handleDeleteEvent(this.state.clickInfo);
    }
    if (this.state.currentEvent == 'approve') {
      this.handleApprove(this.state.clickInfo);
    }
    if (this.state.currentEvent == 'disapproved') {
      this.handleDisapproved(this.state.clickInfo);
    }
    if (this.state.currentEvent == 'displayInfor') {
      this.handleDisplayInfor(this.state.clickInfo)
    }
  }


  handleEvents = (events) => {
    this.setState({
      currentEvents: events
    })
  }

  handleDisplayInfor = async (clickInfo) => {
    if (clickInfo.event.backgroundColor == "#337ab7") {
      let id = clickInfo.event.id;
      var { usageLogs } = this.state;
      let usageLog = usageLogs.filter(item => item._id == id)
      let minutesStart, minutesStop, startTime, stopTime;
      if (clickInfo.event.start.getMinutes() == 0) {
        minutesStart = "00"
      } else {
        minutesStart = clickInfo.event.start.getMinutes();
      }
      startTime = [clickInfo.event.start.getHours(), minutesStart].join(':');

      if (clickInfo.event.end.getMinutes() == 0) {
        minutesStop = "00"
      } else {
        minutesStop = clickInfo.event.start.getMinutes();
      }
      stopTime = [clickInfo.event.end.getHours(), minutesStop].join(':');
      if (usageLog.length !== 0) {
        await this.setState(state => {
          return {
            ...state,
            usageLogDetailInfor: {
              ...clickInfo,
              displayId: id,
              usedByUser: usageLog[0].usedByUser,
              usedByOrganizationalUnit: usageLog[0].usedByOrganizationalUnit,
              startDate: usageLog[0].startDate,
              startTime: startTime,
              endDate: usageLog[0].endDate,
              stopTime: stopTime,
              description: usageLog[0].description,
            }
          }
        });
      }


      window.$(`#modal-display-usage-detail-infor-${id}`).modal('show');
    } else {
      let id = clickInfo.event.id;
      var { recommendDistribute } = this.props;
      let data = recommendDistribute.listRecommendDistributesByAsset.filter(item => item._id == id)
      let minutesStart, minutesStop, startTime, stopTime;
      if (clickInfo.event.start.getMinutes() == 0) {
        minutesStart = "00"
      } else {
        minutesStart = clickInfo.event.start.getMinutes();
      }
      startTime = [clickInfo.event.start.getHours(), minutesStart].join(':');

      if (clickInfo.event.end.getMinutes() == 0) {
        minutesStop = "00"
      } else {
        minutesStop = clickInfo.event.start.getMinutes();
      }
      stopTime = [clickInfo.event.end.getHours(), minutesStop].join(':');
      await this.setState(state => {
        return {
          ...state,
          recommendDistributeDetail: {
            ...clickInfo,
            displayId: id,
            recommendNumber: data[0].recommendNumber,
            dateCreate: data[0].dateCreate,
            proponent: data[0].proponent,
            reqContent: data[0].reqContent,
            asset: data[0].asset,
            dateStartUse: data[0].dateStartUse,
            dateEndUse: data[0].dateEndUse,
            approver: data[0].approver,
            status: data[0].status,
            startTime: startTime,
            stopTime: stopTime,
            note: data[0].note,
          }
        }
      });
      window.$(`#modal-recommenddistribute-detail-${id}`).modal('show');
    }
  }

  handleDeleteEvent = async (clickInfo) => {
    let count, data;
    var { usageLogs } = this.state;
    count = usageLogs.findIndex(item => item._id == clickInfo.event.id)
    data = usageLogs[count]
    usageLogs.splice(count, 1);
    await this.setState({
      ...this.state,
      usageLogs: [...usageLogs],
      currentEvent: undefined,
    })
    clickInfo.event.remove()
    await this.props.deleteUsage(this.props.assetId, clickInfo.event.id)
  }

  handleAddUsage = async (data) => {
    const { assignedToUser, usageLogs, assignedToOrganizationalUnit, currentRow } = this.state
    const { user, assetsManager } = this.props;
    let userlist = user.list;
    let newUsage = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate)
    }

    usageLogs.push(newUsage);

    await this.setState({
      ...this.state,
      assignedToUser: data.usedByUser,
      assignedToOrganizationalUnit: data.usedByOrganizationalUnit,
      status: "in_use",
    })

    let createUsage = {
      usageLogs: usageLogs,
      status: "in_use",
      assignedToUser: data.usedByUser,
      assignedToOrganizationalUnit: data.usedByOrganizationalUnit,
    }

    await this.props.createUsage(this.props.assetId, createUsage)

    // setState createUsage để xử lý dữ liệu của event trong shouldComponentUpdate (đợi dữ liệu trả về)
    await this.setState({
      ...this.state,
      createUsage: true,
    })
  }

  handleCreateUseRequest = async (data) => {
    const { currentRowAdd } = this.state
    const { user } = this.props;
    let userlist = user.list, startDate, endDate, partStart, partEnd;

    partStart = data.dateStartUse.split('-');
    startDate = [partStart[2], partStart[1], partStart[0]].join("-") + " " + data.startTime;

    partEnd = data.dateEndUse.split('-');
    endDate = [partEnd[2], partEnd[1], partEnd[0]].join("-") + " " + data.stopTime;
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    let calendarApi = currentRowAdd.view.calendar;
    if (data) {
      calendarApi.unselect()
      calendarApi.addEvent({
        id: this.props.recommendDistribute.listRecommendDistributes,
        title: userlist.filter(item => item._id === data.proponent).pop() ? userlist.filter(item => item._id === data.proponent).pop().name : "Chưa có đối tượng sử dụng",
        color: '#aaa',
        start: startDate,
        end: endDate,
      })
    }
    await this.props.getRecommendDistributeByAsset(this.props.assetId);
  }

  handleApprove = async (clickInfo) => {
    const { recommendDistribute } = this.props;
    var { usageLogs } = this.state;
    let list, dataRecommendDistribute, value = clickInfo.event.id;
    if (recommendDistribute && recommendDistribute.listRecommendDistributesByAsset) {
      list = recommendDistribute.listRecommendDistributesByAsset;
      dataRecommendDistribute = list.filter(item => item._id == value);
    }
    if (dataRecommendDistribute) {
      await this.props.updateRecommendDistribute(
        dataRecommendDistribute[0]._id,
        {
          recommendNumber: dataRecommendDistribute[0].recommendNumber,
          dateCreate: dataRecommendDistribute[0].dateCreate,
          proponent: dataRecommendDistribute[0].proponent._id, // Người đề nghị
          reqContent: dataRecommendDistribute[0].reqContent,
          asset: dataRecommendDistribute[0].asset._id,
          dateStartUse: dataRecommendDistribute[0].dateStartUse,
          dateEndUse: dataRecommendDistribute[0].dateEndUse,
          approver: dataRecommendDistribute[0].approver, // Người phê duyệt
          note: dataRecommendDistribute[0].note,
          status: "approved",
        })

      let newUsage = {
        usedByUser: dataRecommendDistribute[0].proponent,
        usedByOrganizationalUnit: null,
        startDate: dataRecommendDistribute[0].dateStartUse,
        endDate: dataRecommendDistribute[0].dateEndUse,
      }
      usageLogs.push(newUsage)

      let createUsage = {
        usageLogs: usageLogs,
        status: "in_use",
        assignedToUser: dataRecommendDistribute[0].proponent,
        assignedToOrganizationalUnit: undefined,
      }

      await this.props.createUsage(this.props.assetId, createUsage)
      await this.props.getRecommendDistributeByAsset(this.props.assetId);

      // setState giá trị approved để xử lý dữ liệu của event trong shouldComponentUpdate (đợi dữ liệu trả về)
      await this.setState({
        ...this.state,
        clickInfo: clickInfo,
        approved: true,
        currentEvent: undefined,
      })
    }
  }

  handleDisapproved = async (clickInfo) => {
    const { recommendDistribute } = this.props;
    var { usageLogs } = this.state;
    let list, dataRecommendDistribute, value = clickInfo.event.id;

    if (recommendDistribute && recommendDistribute.listRecommendDistributesByAsset) {
      list = recommendDistribute.listRecommendDistributesByAsset;
      dataRecommendDistribute = list.filter(item => item._id == value);
    }
    if (dataRecommendDistribute) {
      await this.props.updateRecommendDistribute(
        dataRecommendDistribute[0]._id,
        {
          recommendNumber: dataRecommendDistribute[0].recommendNumber,
          dateCreate: dataRecommendDistribute[0].dateCreate,
          proponent: dataRecommendDistribute[0].proponent._id, // Người đề nghị
          reqContent: dataRecommendDistribute[0].reqContent,
          asset: dataRecommendDistribute[0].asset._id,
          dateStartUse: dataRecommendDistribute[0].dateStartUse,
          dateEndUse: dataRecommendDistribute[0].dateEndUse,
          approver: dataRecommendDistribute[0].approver, // Người phê duyệt
          note: dataRecommendDistribute[0].note,
          status: "disapproved",
        })

      clickInfo.event.setProp("backgroundColor", "#dd4b39")
      clickInfo.event.setProp("borderColor", "#dd4b39")

      await this.props.getRecommendDistributeByAsset(this.props.assetId);
    }

    await this.setState({
      ...this.state,
      currentEvent: undefined
    })
  }


  renderEventContent = (eventInfo) => {
    return (
      <>
        <div className="form-inline">
          <div className="form-group">

            <a className="edit" title="Information" style={{ color: "whitesmoke", cursor: "pointer" }} data-toggle="tooltip" onClick={async () => {
              await this.setState({
                currentEvent: 'displayInfor',
              }, () => {
                return this.handleEventClick
              })

            }}><i className="material-icons" id="display-event">view_list</i></a>
          </div>

          {(eventInfo.event.borderColor != "#337ab7" && this.props.managedBy == this.state.userId) &&
            <div className="form-group">
              <a className="edit" title="Approve" style={{ color: "whitesmoke", cursor: "pointer" }} data-toggle="tooltip" onClick={async () => {
                await this.setState({
                  currentEvent: 'approve',
                }, () => {
                  return this.handleEventClick
                })

              }}><i className="material-icons" id="approve-event">check_circle_outline</i></a>
              <a className="edit" title="Disapproved" style={{ color: "whitesmoke", cursor: "pointer" }} data-toggle="tooltip" onClick={async () => {
                await this.setState({
                  currentEvent: 'disapproved',
                }, () => {
                  return this.handleEventClick
                })

              }}><i className="material-icons" id="disapprove-event">block</i></a>
            </div>

          }
          {eventInfo.event.borderColor == "#337ab7" &&
            <div className="form-group">
              <a className="delete" title="Delete" style={{}} data-toggle="tooltip" onClick={async () => {
                await this.setState({
                  currentEvent: 'delete',
                }, () => {
                  return this.handleEventClick
                })

              }}><i className="material-icons" id="delete-event"></i></a>
            </div>

          }


        </div>
        <br />
        <i>{eventInfo.event.title}</i><br />
        <b>{eventInfo.timeText}</b><br />
      </>
    )
  }

  renderSidebarEvent(event) {
    return (
      <li key={event.id}>
        <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
        <i>{event.title}</i>
      </li>
    )
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.id !== prevState.id || nextProps.usageLogs !== prevState.usageLogs) {
      let usageLogs = [];
      let userlist = nextProps.user.list
      let departmentlist = nextProps.department.list
      let data = prevState.data
      for (let i in nextProps.usageLogs) {
        let check = data.filter(item => item.id == nextProps.usageLogs[i]._id)
        if (!check.length) {
          let title;
          if (nextProps.usageLogs[i].usedByUser && nextProps.usageLogs[i].usedByOrganizationalUnit) {
            let usedByUser = userlist.filter(item => item._id === nextProps.usageLogs[i].usedByUser).pop() ? userlist.filter(item => item._id === nextProps.usageLogs[i].usedByUser).pop().name : "Chưa có đối tượng sử dụng"
            let usedByOrganizationalUnit = departmentlist.filter(item => item._id === nextProps.usageLogs[i].usedByOrganizationalUnit).pop() ? departmentlist.filter(item => item._id === nextProps.usageLogs[i].usedByOrganizationalUnit).pop().name : "Chưa có đối tượng sử dụng"
            title = usedByUser + ', ' + usedByOrganizationalUnit
          } else if (nextProps.usageLogs[i].usedByUser && !nextProps.usageLogs[i].usedByOrganizationalUnit) {
            title = userlist.filter(item => item._id === nextProps.usageLogs[i].usedByUser).pop() ? userlist.filter(item => item._id === nextProps.usageLogs[i].usedByUser).pop().name : "Chưa có đối tượng sử dụng"
          } else if (!nextProps.usageLogs[i].usedByUser && nextProps.usageLogs[i].usedByOrganizationalUnit) {
            title = departmentlist.filter(item => item._id === nextProps.usageLogs[i].usedByOrganizationalUnit).pop() ? departmentlist.filter(item => item._id === nextProps.usageLogs[i].usedByOrganizationalUnit).pop().name : "Chưa có đối tượng sử dụng"
          }

          usageLogs.push({
            id: nextProps.usageLogs[i]._id,
            title: title,
            color: '#337ab7',
            start: new Date(nextProps.usageLogs[i].startDate),
            end: new Date(nextProps.usageLogs[i].endDate),
          })
        }
      }
      return {
        ...prevState,
        id: nextProps.id,
        usageLogs: nextProps.usageLogs,
        assignedToUser: nextProps.assignedToUser,
        assignedToOrganizationalUnit: nextProps.assignedToOrganizationalUnit,
        typeRegisterForUse: nextProps.typeRegisterForUse,
        data: [...prevState.data, ...usageLogs]
      }
    } else {
      return null;
    }
  }

  render() {
    const { assetId } = this.props;
    var { currentRow, typeRegisterForUse, usageLogs, currentRowAdd, usageLogDetailInfor, recommendDistributeDetail } = this.state;

    return (
      <div className='demo-app'>
        <div className='demo-app-main'>
          {((this.state.dataStatus == 2))
            &&
            <Scheduler
              className="asset-usage-scheduler"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'timeGridWeek'
              }}
              updateSizeEventRegistrations={[ // Áp dụng khi mở lại modal (trước đó modal đã mở và tab usage được chọn)
                { selector: "#modal-view-asset", eventName: "shown.bs.modal" },
                { selector: "#modal-edit-asset", eventName: "shown.bs.modal" },
              ]}
              initialView='timeGridWeek'
              // editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              now={this.state.nowDate}
              weekends={this.state.weekendsVisible}
              initialEvents={this.state.data} // alternatively, use the `events` setting to fetch from a feed
              select={this.handleDateSelect}
              // eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
              eventContent={this.renderEventContent}
              eventClick={this.handleEventClick}
            />
          }
        </div>

        {currentRow &&
          <UsageLogAddModal
            calendarUsage={`calendar`}
            handleChange={this.handleAddUsage}
            id={`calendar-${assetId}`}
            typeRegisterForUse={typeRegisterForUse}
            startDate={currentRow.start}
            endDate={currentRow.end}
            startTime={currentRow.startTime}
            stopTime={currentRow.stopTime}
          />
        }

        {
          currentRowAdd &&
          <UseRequestCreateForm
            _id={`calendar-${assetId}`}
            asset={assetId}
            typeRegisterForUse={typeRegisterForUse}
            managedBy={currentRowAdd.managedBy}
            startDate={currentRowAdd.start}
            endDate={currentRowAdd.end}
            startTime={currentRowAdd.startTime}
            stopTime={currentRowAdd.stopTime}
            handleChange={this.handleCreateUseRequest}
          />
        }

        {
          usageLogDetailInfor &&
          <UsageLogDetailModal
            id={usageLogDetailInfor.displayId}
            usedByUser={usageLogDetailInfor.usedByUser}
            usedByOrganizationalUnit={usageLogDetailInfor.usedByOrganizationalUnit}
            startDate={usageLogDetailInfor.startDate}
            startTime={usageLogDetailInfor.startTime}
            endDate={usageLogDetailInfor.endDate}
            stopTime={usageLogDetailInfor.stopTime}
            description={usageLogDetailInfor.description}
          />
        }
        {
          recommendDistributeDetail &&
          <UseRequestDetailForm
            _id={recommendDistributeDetail.displayId}
            id={recommendDistributeDetail.displayId}
            recommendNumber={recommendDistributeDetail.recommendNumber}
            dateCreate={recommendDistributeDetail.dateCreate}
            proponent={recommendDistributeDetail.proponent}
            reqContent={recommendDistributeDetail.reqContent}
            asset={recommendDistributeDetail.asset}
            dateStartUse={recommendDistributeDetail.dateEndUse}
            dateEndUse={recommendDistributeDetail.dateEndUse}
            approver={recommendDistributeDetail.approver}
            status={recommendDistributeDetail.status}
            startTime={recommendDistributeDetail.startTime}
            stopTime={recommendDistributeDetail.stopTime}
            note={recommendDistributeDetail.note}
          />
        }
      </div>
    )
  }
}




function mapState(state) {
  const { user, department, recommendDistribute, assetsManager } = state;
  return { user, department, recommendDistribute, assetsManager };
};

const actionCreators = {
  getRecommendDistributeByAsset: RecommendDistributeActions.getRecommendDistributeByAsset,
  updateRecommendDistribute: RecommendDistributeActions.updateRecommendDistribute,
  createUsage: UseRequestActions.createUsage,
  deleteUsage: UseRequestActions.deleteUsage,
};

const calendarUsage = connect(mapState, actionCreators)(withTranslate(CalendarUsage));

export { calendarUsage as CalendarUsage };
