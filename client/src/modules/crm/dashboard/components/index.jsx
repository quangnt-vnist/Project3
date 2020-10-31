import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class CrmDashBoard extends Component {
    render() {
        return (
            <div>
                <marquee behavior="" direction="">Đây là DashBoard ^_^</marquee>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmDashBoard));