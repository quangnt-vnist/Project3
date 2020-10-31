import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';

class DateTimeConverter extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    convertDateTime = (time, type) => {
        var dateNow = new Date();
        var date = new Date(time);
        var diff = (dateNow - date)/3600000; // đơn vị là giờ
        if(type === 'DD-MM-YYYY'){
            return moment(time).format('DD-MM-YYYY');
        }else {
            if(diff < 24) // cách biệt không quá 24 giờ
                return moment(time).fromNow();
            else    
                return moment(time).format('LLL');
        }
    }

    render() { 
        const {dateTime, type} = this.props;

        return <span>{this.convertDateTime(dateTime, type)}</span>;
    }
}
 

const mapState = state => state;
const DateTimeConverterExport = connect(mapState, null)(withTranslate(DateTimeConverter));
export { DateTimeConverterExport as DateTimeConverter }