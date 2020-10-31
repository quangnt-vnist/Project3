import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Header from './header/components/header';
import SideBar from './sidebar/components/sidebar';
import Content from './content/components/content';
import Footer from './footer/components/footer';
class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = { }
    }

    render() { 
        const {auth, translate} = this.props;

        return (
            <React.Fragment>
                <Header
                    userId={auth.user._id}
                    userName={auth.user.name}
                    userEmail={auth.user.email}
                />
                <SideBar />
                <Content arrPage={this.props.arrPage} isLoading={this.props.isLoading} pageName={ translate(`menu.${this.props.pageName}`) }>{ this.props.children }</Content>
                <Footer />
            </React.Fragment>
        );
    }
}
 
const mapStateToProps = state => {
    const {auth} = state;
    return {auth};
}

export default connect( mapStateToProps, null )( withTranslate(Layout) );