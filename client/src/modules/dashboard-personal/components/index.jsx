import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ComponentInfor } from './combinedContent';
import { UserActions } from '../../super-admin/user/redux/actions';

class DashboardPersonal extends Component {
    constructor(props) {
        super(props);
    };
    componentDidMount() {
        this.props.getDepartment();
    }
    render() {
        const { user } = this.props;
        return (
            <React.Fragment>
                { user.organizationalUnitsOfUser
                    && <ComponentInfor organizationalUnitsOfUser={user.organizationalUnitsOfUser} />
                }
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { user } = state;
    return { user };
}

const actionCreators = {
    getDepartment: UserActions.getDepartmentOfUser,
};

const dashboardPersonal = connect(mapState, actionCreators)(withTranslate(DashboardPersonal));
export { dashboardPersonal as DashboardPersonal };