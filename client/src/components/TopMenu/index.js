import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import UnathorizedComponent from '../../components/UnathorizedComponent';
import ProtectedComponent from '../../components/ProtectedComponent';

import logo from '../../images/icon.svg';
import enter from '../../images/search.svg';
import add from '../../images/add.svg';
import home from '../../images/home.svg';
import login from '../../images/login.svg';
import profile from '../../images/user.svg';
import {isLoggedIn} from "../../util";

class TopMenu extends Component {
    render() {
        return (
            <div style={{
                color: 'white',
                display: 'flex',
                justifyContent: 'space-evenly',
                backgroundColor: 'orange',
                height: 45,
                alignItems: 'center'
            }}>
                <Link style={{color: 'white', height: 35}} to={'/'}><img height="35" src={home}/></Link>
                <ProtectedComponent>
                    <Link style={{color: 'white', height: 35}} to={'/newParty'}><img height="35" src={add}/></Link>
                </ProtectedComponent>
                <ProtectedComponent>
                    <Link style={{color: 'white', height: 35}} to={'/parties'}><img height="35" src={enter}/></Link>
                </ProtectedComponent>
                <ProtectedComponent>
                    <Link style={{color: 'white', height: 35}} to={'/me'}><img height="35" src={profile}/></Link>
                </ProtectedComponent>
                <UnathorizedComponent>
                    <Link style={{color: 'white', height: 35}} to={'/login'}><img height="35" src={login}/></Link>
                </UnathorizedComponent>
                <ProtectedComponent>
<span onClick={() => {
                    localStorage.removeItem('auth');
                    window.location.reload();
                }} style={{textDecoration: 'underline', cursor: 'pointer', height: 35}}><img height="35"
                                                                                             src={logo}/></span>
                </ProtectedComponent>
            </div>
        );
    }
}

export default TopMenu;
