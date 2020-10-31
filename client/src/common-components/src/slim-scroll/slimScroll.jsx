import { Component } from 'react';
import "./slimScroll.css";

class SlimScroll extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidUpdate() {
        this.addStyleCSS();
    }

    componentDidMount() {
        this.addStyleCSS();
    }

    addStyleCSS = () => {
        const { outerComponentId, innerComponentId, innerComponentWidth, activate } = this.props;

        let outer = window.$(`#${outerComponentId}`);
        let inner = window.$(`#${innerComponentId}`);

        if (outer !== undefined && inner !== undefined) {
            if (activate) {
                outer.addClass("StyleScrollDiv");
                inner.width(innerComponentWidth);
                inner.css("maxWidth", innerComponentWidth); // Safari
            } else {
                outer.removeClass("StyleScrollDiv");
                inner.width("");
                inner.css("maxWidth", ""); // Safari
            }
        }
    }

    render() {
        return null;
    }
}

export { SlimScroll }
