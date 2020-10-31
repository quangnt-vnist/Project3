import React, { Component } from 'react';
import './loading.css';

class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <React.Fragment>
                <span>
                    <div className="loader"></div>
                </span>
                <div className="bg-loader" id="loading-data" style={{display: "block"}}></div>
            </React.Fragment>
         );
    }
}
 
export { Loading };