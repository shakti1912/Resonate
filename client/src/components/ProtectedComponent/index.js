import React from 'react';

import {isLoggedIn} from "../../util";

class ProtectedComponent extends React.PureComponent {
    render() {
        return (
                    isLoggedIn()
                        ? <div>{this.props.children}</div>
                        : <div style={{display: 'none'}}/>
        )
    }
}

export default ProtectedComponent;
