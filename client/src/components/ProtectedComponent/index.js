import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import logo from '../../images/icon.svg';
import enter from '../../images/search.svg';
import add from '../../images/add.svg';
import home from '../../images/home.svg';
import login from '../../images/login.svg';
import profile from '../../images/user.svg';
import {isLoggedIn} from "../../util";

class ProtectedComponent extends React.PureComponent {
    render() {
        return (
            <div>
                {isLoggedIn() ? <div>
                    {this.props.children}
                </div> : ''
                }
            </div>
        )
    }
}

export default ProtectedComponent;
