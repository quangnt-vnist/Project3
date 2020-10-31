import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate, IntlActions } from 'react-redux-multilingual';
import { AuthActions } from '../../auth/redux/actions';
import { getStorage, setStorage } from '../../../config';
import { Link } from 'react-router-dom';
import moment from "moment";
import store from '../../../redux/store';
import './intro.css';

const Introduction = (props) => {
    const [user, setUser] = useState({});
    const { translate } = props;
    const _setLanguage = () => {
        window.$('#dx-language-setting').slideToggle()
    }

    const _setVie = () => {
        setStorage('lang', 'vn');
        moment.locale("vi")
        store.dispatch(IntlActions.setLocale('vn'));
    }

    const _setEng = () => {
        setStorage('lang', 'en');
        moment.locale("en")
        store.dispatch(IntlActions.setLocale('en'));
    }

    useEffect(() => {
        const user = getStorage('userId');
        setUser(user);
        if (user) {
            props.refresh();

            const currentRole = getStorage("currentRole");
            props.getLinksOfRole(currentRole)
                .then(res => {
                    setUser(props.auth.user._id);
                });
        }
    }, [user]);

    return (
        <React.Fragment>
            <header className="fixed-top p-center-h">
                <h3>DX Workspace</h3>
                <span id="dx-language-setting" className="dx-language-setting p-center-h">
                    <a style={{ cursor: "pointer" }} onClick={_setEng}><img src='/library/dx/images/eng.png' className="img-circle" /></a>
                    <a style={{ cursor: "pointer" }} onClick={_setVie}><img src='/library/dx/images/vietnam.png' className="img-circle" /></a>
                </span>
                <span className="dx-language">
                    <button onClick={_setLanguage}><i className="fa fa-language"></i></button>
                </span>
                <span className="dx-auth">
                    {
                        user ?
                            <Link to="/home" className="dx-workspace-button">{translate('intro.auth.start')}</Link> :
                            <Link to="/login" className="dx-workspace-button">{translate('intro.auth.signin')}</Link>
                    }
                </span>
            </header>
            <section id="dx-intro" className="dx-container">

                <div className="row p-center-h">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h2 className="dx-sologan text-center">{translate('intro.title')}</h2>
                        <ul className="dx-services">
                            {
                                translate('intro.contents').map(content => (
                                    <li className="dx-service-item">
                                        <i className="fa fa-check"></i>
                                        {content}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <img className="dx-intro-image" src='/library/dx/images/image4.png' style={{ borderRadius: '50%' }} />
                    </div>
                </div>

            </section>

            <section id="dx-service" className="dx-container">
                <h3 className="text-center">{translate('intro.service.title')}</h3>
                <p>{translate('intro.service.content')}</p>
                <div className="row p-center">
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="dx-card">
                            <div className="dx-card-header">
                                <img className="service-image" src='/library/dx/images/kpi.png' />
                            </div>
                            <div className="dx-card-body">
                                <h4>{translate('intro.service.kpi.title')}</h4>
                                <p>{translate('intro.service.kpi.content')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="dx-card">
                            <div className="dx-card-header">
                                <img className="service-image" src='/library/dx/images/task.png' />
                            </div>
                            <div className="dx-card-body">
                                <h4>{translate('intro.service.task.title')}</h4>
                                <p>{translate('intro.service.task.content')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="dx-card">
                            <div className="dx-card-header">
                                <img className="service-image" src='/library/dx/images/document.png' />
                            </div>
                            <div className="dx-card-body">
                                <h4>{translate('intro.service.document.title')}</h4>
                                <p>{translate('intro.service.document.content')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="dx-card">
                            <div className="dx-card-header">
                                <img className="service-image" src='/library/dx/images/employee.png' />
                            </div>
                            <div className="dx-card-body">
                                <h4>{translate('intro.service.employee.title')}</h4>
                                <p>{translate('intro.service.employee.content')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="dx-card">
                            <div className="dx-card-header">
                                <img className="service-image" src='/library/dx/images/assets.png' />
                            </div>
                            <div className="dx-card-body">
                                <h4>{translate('intro.service.asset.title')}</h4>
                                <p>{translate('intro.service.asset.content')}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

            <section className="dx-container">

                <div className="row p-center-h">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h2 className="dx-sologan text-center">{translate('intro.service.task.title')}</h2>
                        <p>{translate('intro.service.task.detail')}</p>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <img className="dx-intro-image dx-card" src='/library/dx/images/mtask.png' />
                    </div>
                </div>

            </section>

            <section className="dx-container">

                <div className="row p-center-h">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <img className="dx-intro-image dx-card" src='/library/dx/images/mkpi.png' />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h2 className="dx-sologan text-center">{translate('intro.service.kpi.title')}</h2>
                        <p>{translate('intro.service.kpi.detail')}</p>
                    </div>
                </div>

            </section>

            <section className="dx-container">

                <div className="row p-center-h">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h2 className="dx-sologan text-center">{translate('intro.service.document.title')}</h2>
                        <p>{translate('intro.service.document.detail')}</p>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <img className="dx-intro-image dx-card" src='/library/dx/images/mdocument.png' />
                    </div>
                </div>

            </section>

            <section className="dx-container">

                <div className="row p-center-h">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <img className="dx-intro-image dx-card" src='/library/dx/images/memployee.png' />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h2 className="dx-sologan text-center">{translate('intro.service.employee.title')}</h2>
                        <p>{translate('intro.service.employee.detail')}</p>
                    </div>
                </div>

            </section>

            <section className="dx-container">

                <div className="row p-center-h">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h2 className="dx-sologan text-center">{translate('intro.service.asset.title')}</h2>
                        <p>{translate('intro.service.asset.detail')}</p>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <img className="dx-intro-image dx-card" src='/library/dx/images/masset.png' />
                    </div>
                </div>

            </section>

            <section id="dx-service-signup" className="dx-container">

                <div className="row p-center-h">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h3 className="text-center">{translate('intro.service_signup.title')}</h3>
                        <ul className="dx-services">
                            {
                                translate('intro.service_signup.content').map(content => (
                                    <li className="dx-service-item">
                                        <i className="fa fa-check"></i>
                                        {content}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <form class="dx-service">
                            <input placeholder={translate('intro.service_signup.form.customer')}></input>
                            <input placeholder={translate('intro.service_signup.form.email')}></input>
                            <input placeholder={translate('intro.service_signup.form.phone')}></input>
                            <select>
                                <option>{translate('intro.service_signup.form.type.choose')}</option>
                                <option>{translate('intro.service_signup.form.type.standard')}</option>
                                <option>{translate('intro.service_signup.form.type.full')}</option>
                            </select>
                            <button className="send">{translate('intro.service_signup.form.send')}</button>
                        </form>
                    </div>
                </div>

            </section>

            <section id="dx-location" className="dx-container">

                <div className="row p-center">
                    <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                        <div dangerouslySetInnerHTML={{ __html: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.649329143436!2d105.8440409142974!3d21.006689393908722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac760a8b09cf%3A0xd78e46d7bbefe566!2zTmfDtSAzMCBU4bqhIFF1YW5nIELhu611LCBCw6FjaCBLaG9hLCBIYWkgQsOgIFRyxrBuZywgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1603851884788!5m2!1svi!2s" width="100%" height="400" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>' }}></div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <h3 className="text-center">{translate('intro.address.title')}</h3>
                        <ul className="dx-locations">
                            <li className="dx-location-item">
                                <i className="fa fa-map-marker"></i>
                                {translate('intro.address.content.location')}
                            </li>
                            <li className="dx-location-item">
                                <i className="fa fa-phone"></i>
                                {translate('intro.address.content.phone')}
                            </li>
                            <li className="dx-location-item">
                                <i className="fa fa-envelope"></i>
                                {translate('intro.address.content.email')}
                            </li>
                        </ul>
                    </div>
                </div>

            </section>


            <section id="dx-contact" className="dx-container">

                <div className="row">
                    <h3 className="dx-contact">{translate('intro.contact.title')}</h3>
                    <p class="dx-contact">{translate('intro.contact.company')}</p>
                    <form className="dx-contact">
                        <input placeholder={translate('intro.contact.form.name')}></input>
                        <input placeholder={translate('intro.contact.form.email')}></input>
                        <textarea placeholder={translate('intro.contact.form.content')}></textarea>
                        <button className="dx-contact">{translate('intro.contact.form.send')}</button>
                    </form>
                </div>

            </section>
            <section id="dx-footer" className="dx-container">

                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <h4 className="text-center text-bold">{translate('intro.footer.about_us.title')}</h4>
                        <p>{translate('intro.footer.about_us.content')}</p>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <h4 className="text-center text-bold">{translate('intro.footer.care.title')}</h4>
                        <ul className="dx-footer care">
                            <li className="dx-footer care item p-center-h">
                                <i className="fa fa-square"></i>
                                {translate('intro.footer.care.content.company')}<a href="https://vnist.vn/" style={{ marginLeft: 2 }}> VNIST </a>
                            </li>
                            <li className="dx-footer care item p-center-h">
                                <i className="fa fa-square"></i>
                                {translate('intro.footer.care.content.research')}
                            </li>
                        </ul>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <h4 className="text-center text-bold">{translate('intro.footer.media.title')}</h4>
                        <span className="p-center media">
                            <img className="dx-content1 image" src='/library/dx/images/facebook.png' />
                            <img className="dx-content1 image" src='/library/dx/images/youtube.png' />
                            <img className="dx-content1 image" src='/library/dx/images/twitter.png' />
                            <img className="dx-content1 image" src='/library/dx/images/pinterest.png' />
                            <img className="dx-content1 image" src='/library/dx/images/google-plus.png' />
                        </span>
                    </div>
                </div>

            </section>

            <footer className="dx-footer dx-container">
                <div className="copyright">{translate('intro.footer.copyright')}</div>
            </footer>
        </React.Fragment>
    );
}

function mapState(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {
    refresh: AuthActions.refresh,
    getLinksOfRole: AuthActions.getLinksOfRole,
    getComponentsOfUserInLink: AuthActions.getComponentOfUserInLink,
}

const connectedIntroduction = connect(mapState, mapDispatchToProps)(withTranslate(Introduction));
export { connectedIntroduction as Introduction };