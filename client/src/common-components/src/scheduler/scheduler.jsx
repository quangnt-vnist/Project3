import React, { Component } from 'react';
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import './scheduler.css';

class Scheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.calendarRef = React.createRef();
        this.id = "full-calendar-react"; // id mặc định
    }

    static triggerOnActiveEvent = (selector) => {
        window.$(selector).trigger("onActive");
    }

    updateSize = () => {
        if (this.calendarRef.current && this.calendarRef.current.getApi()) {
            let api = this.calendarRef.current.getApi();
            if (api) {
                api.updateSize();
            }
        };
    }

    componentDidMount = () => {
        let { id = this.id, updateSizeEventRegistrations = [] } = this.props;
        updateSizeEventRegistrations.push({
            selector: `#${id}`,
            eventName: "onActive"
        })
        updateSizeEventRegistrations.forEach(element => {
            window.$(element.selector).on(element.eventName, (e) => {
                this.updateSize();
            })
        });
    }

    render() {
        const { id = this.id, height="auto", className, plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin], ...others } = this.props;

        return (
            <div id={id} className={className}>
                <FullCalendar
                    ref={this.calendarRef}
                    plugins={plugins}
                    height={height}
                    {...others}
                />
            </div>
         );
    }
}
 
export { Scheduler, formatDate };