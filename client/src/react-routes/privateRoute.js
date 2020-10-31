import React from 'react';
import { Route, Redirect} from 'react-router-dom';
import { getStorage } from  '../config';
import {CallApiStatus} from '../modules/auth/redux/reducers';

const checkURL = (urlName, linkArr) => {
    var result = false;
    if(linkArr !== undefined){
        linkArr.forEach(link => {
            if(link.url === urlName){
                result = true;
            }
        });
    }

    return result;
}

export const PrivateRoute = ({ auth, isLoading, arrPage, pageName, link, component: Component, layout: Layout, ...rest }) => {
    return <Route {...rest} render={props => {
        var logged = getStorage();
        if(logged !== null){
            if(auth.calledAPI !== CallApiStatus.FINISHED)
                return <Layout></Layout>
            
            if(link !== '/' && checkURL(link, auth.links) !== true){
                return <Redirect to='/home'/>
            } 
            return <Layout arrPage={ arrPage } pageName={ pageName } isLoading={ isLoading }><Component {...props}/></Layout>
        }else{
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
    }} />
}
