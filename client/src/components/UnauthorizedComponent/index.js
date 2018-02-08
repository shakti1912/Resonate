import React from 'react';
import {isLoggedIn} from "../../util";

class UnauthorizedComponent extends React.PureComponent {
    render() {
        return (
            !isLoggedIn()
                ? <div>{this.props.children}</div>
                : <div style={{display: 'none'}}/>

        )
    }
}

export default UnauthorizedComponent;
