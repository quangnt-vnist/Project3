import React, { Component } from 'react';

import LazyLoad from 'react-lazyload';

import { Loading } from '../../index';

class LazyLoadComponent extends Component {

    constructor(props) {
        super(props);
        
        this.state = {

        }
    }

    placeHolder() {
        return (
            <div className="placeholder" style={{ textAlign: "center" }}>
                <Loading/>
            </div>
        )
    } 

    render() {
        const {
            height = 200,
            unmountIfInvisible = false,
            scroll = true,
            once = false,
            offset = 0,
            overflow = false,
            resize = false,
            children = undefined,
            throttle = false,
            debounce = false,
            scrollContainer = undefined
        } = this.props;

        return (
            <LazyLoad
                height={height}
                unmountIfInvisible={unmountIfInvisible}
                placeholder={this.placeHolder()}
                once={once}
                offset={offset}
                overflow={overflow}
                resize={resize}
                scroll={scroll}
                children={children}
                throttle={throttle}
                debounce={debounce}
                scrollContainer={scrollContainer}
            >
                {this.props.children}
            </LazyLoad>
        )
    }
}

export { LazyLoadComponent };