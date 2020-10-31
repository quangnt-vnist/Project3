import React, { Component } from 'react';

class ErrorLabel extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() { 
        const { content } = this.props;
        return ( 
            <React.Fragment>
                {
                    content && <div className="help-block">{content}</div>
                }
            </React.Fragment>
         );
    }
}
 
export { ErrorLabel };