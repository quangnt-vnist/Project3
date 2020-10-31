
import moment from 'moment';
import React, { Component } from 'react';
import ReactCalendarTimeline from 'react-calendar-timeline';

var groups = [
    { id: 1, title: 'group 1' },
    { id: 2, title: 'group 2' }
];

var items = [
    {
        id: 1,
        group: 1,
        title: 'item 1',
        start: moment().add(1, 'day').hours(0).minutes(0).seconds(0),
        end: moment().add(4, 'day').hours(6).minutes(0).seconds(0)
    },
    {
        id: 2,
        group: 2,
        title: 'item 2',
        start: moment().add(-1, 'day').hours(0).minutes(0).seconds(0),
        end: moment().add(1, 'day').hours(0).minutes(0).seconds(0)
    },
    {
        id: 3,
        group: 2,
        title: 'item 3',
        start: moment().add(2, 'day').hours(0).minutes(0).seconds(0),
        end: moment().add(3, 'day').hours(0).minutes(0).seconds(0)
    }
];


var minTime = moment().add(-6, 'months').valueOf()
var maxTime = moment().add(6, 'months').valueOf()

let defaultTimeStart = moment()
    .startOf("month")
    .toDate();

let defaultTimeEnd = moment()
    .startOf("month")
    .add(1, "month")
    .toDate();

var props = {
    groups: groups,
    items: items,
    fixedHeader: 'fixed',
    canMove: true, // defaults
    canResize: true,
    itemsSorted: true,
    itemTouchSendsClick: false,
    stackItems: true,
    itemHeightRatio: 0.75,
    dragSnap: moment.duration(1, 'days').asMilliseconds(),

    defaultTimeStart: moment().add(-7, 'day'),
    defaultTimeEnd: moment().add(7, 'day'),

    maxZoom: moment.duration(2, 'months').asMilliseconds(),
    minZoom: moment.duration(3, 'days').asMilliseconds(),

    keys: {
        groupIdKey: 'id',
        groupTitleKey: 'title',
        itemIdKey: 'id',
        itemTitleKey: 'title',
        itemGroupKey: 'group',
        itemTimeStartKey: 'start',
        itemTimeEndKey: 'end'
    },

    onItemClick: function (item) {
        console.log("Clicked: " + item);
    },

    onItemSelect: function (item) {
        console.log("Selected: " + item);
    },

    onItemContextMenu: function (item) {
        console.log("Context Menu: " + item);
    },


    // this limits the timeline to -6 months ... +6 months
    onTimeChange: function (visibleTimeStart, visibleTimeEnd) {
        if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
            this.updateScrollCanvas(minTime, maxTime)
        } else if (visibleTimeStart < minTime) {
            this.updateScrollCanvas(minTime, minTime + (visibleTimeEnd - visibleTimeStart))
        } else if (visibleTimeEnd > maxTime) {
            this.updateScrollCanvas(maxTime - (visibleTimeEnd - visibleTimeStart), maxTime)
        } else {
            this.updateScrollCanvas(visibleTimeStart, visibleTimeEnd)
        }
    }
}
var filter = React.createElement("div", {}, "The filter");

/* jshint undef:false */
const MyCalendar = React.createElement(ReactCalendarTimeline['default'], props, filter);

export default MyCalendar;

