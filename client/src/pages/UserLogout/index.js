import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import { logout } from "../../util";

class UserLogout extends Component {
    componentDidMount() {
        logout();
    }

    render() {
        return (
            <div>
                <Redirect to={'/login'}/>
            </div>
        );
    }
}

export default UserLogout;
