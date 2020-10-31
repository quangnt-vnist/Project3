import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
// import './tooltip.css';

class ToolTip extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount = () => {
        window.$('[data-toggle="tooltip"]').tooltip();
    }

    displayDefault = (data) => {
        let content = data.join(', ');
        let title = <span>{content}</span>
        return <React.Fragment>
            {
                data.map((element, index, arr) => {
                    if (arr.length < 4) {
                        if (index !== arr.length - 1) return `${element}, `;
                        else return `${element}`
                    } else {
                        if (index < 3) {
                            return `${element}, `
                        }
                    }
                })
            }
            {
                data.length >= 4 &&
                // <a href="#" data-toggle="tooltip" data-placement="auto" title={title}>...</a>
                <Tooltip placement="top" overlay={title}>
                    <a style={{ cursor: "pointer" }}>...</a>
                </Tooltip>
            }
        </React.Fragment>
    }

    displayTooltipForIcon = (data, icon) => {
        // let title = data.map(element => {
        //     return `${element}`
        // })
        let content = data.join(', ');
        let title = <span>{content}</span>

        return <React.Fragment>
            <Tooltip placement="topLeft" overlay={title}>
                <a style={{ cursor: "pointer" }}>
                    <i className="material-icons">{icon}</i>
                </a>
            </Tooltip>
        </React.Fragment>
    }

    displayTitleContent = (data) => {
        var convertData = [];
        var min = data.length > 5 ? data.length - 5 : 0;
        for (let index = data.length - 1; index >= min; index--) {
            const element = data[index];
            convertData.push(element);
        }
        if (data.length <= 0)
            return null;
        else return <React.Fragment>
            <div className="tooltip2">
                <u className="text-blue" style={{ marginLeft: '3px' }}>chi tiết</u>
                <span className="tooltip2text">
                    {convertData.map((content, i) => {
                        return <p key={i} className="text-left" style={{
                            border: '0.2px solid gray',
                            borderRadius: '1px',
                            padding: '3px'
                        }}>{content}</p>
                    })}
                </span>
            </div>
        </React.Fragment>

    }

    diplayToolTip = (data, type, icon) => {
        switch (type) {
            case 'latest_history':
                return this.displayTitleContent(data);
            case 'icon_tooltip':
                return this.displayTooltipForIcon(data, icon);
            default:
                return this.displayDefault(data);
        }
    }

    render() {
        const { dataTooltip, type = undefined, materialIcon = "help" } = this.props;
        return this.diplayToolTip(dataTooltip, type, materialIcon);
    }
}


const mapState = state => state;
const ToolTipExport = connect(mapState, null)(withTranslate(ToolTip));
export { ToolTipExport as ToolTip }