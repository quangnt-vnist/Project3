import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../css/mainHeaderMenu.css';
import { withTranslate } from 'react-redux-multilingual';
import Notifications from './notification';
import Profile from './profile';
import Roles from './roles';
import Language from './language';
//import { getStorage } from '../../../config';

class MainHeaderMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }
    
    checkURL = (urlName, linkArr) => {
        var result = false;
        if (linkArr !== undefined) {
            linkArr.forEach(link => {
                if (link.url === urlName) {
                    result = true;
                }
            });
        }

        return result;
    }

    render() {
        const { auth } = this.props;
        return (
            <React.Fragment>
                <div className="navbar-custom-menu">
                    <ul className="nav navbar-nav">
                        <Roles />
                        {
                            this.checkURL('/notifications', auth.links) && 
                            <Notifications/>
                        }
                        <Language />
                        <Profile />
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(MainHeaderMenu));
