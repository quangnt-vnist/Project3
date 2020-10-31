import React, { Component } from 'react';
import Draggable from 'react-draggable';

import './pinnedPanel.css';

class PinnedPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <React.Fragment>
                {
                    React.Children.map(this.props.children, (child, index) => {
                        let id = `draggable-${index}`;
                        return (
                            <Draggable
                                cancel="textarea, a, i, button, input, label"
                                handle={`#${id}`}
                                key={id}
                                defaultPosition={{ x: 0, y: 0 }}
                                position={null}
                                allowAnyClick={true}
                                grid={[1, 1]}
                                onStart={this.handleStart}
                                onDrag={this.handleDrag}
                                onStop={this.handleStop}>
                                <div id={id} className="pinned-panel">
                                    {child}
                                </div>
                            </Draggable>
                        )
                    })
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return state;
}

export { PinnedPanel };