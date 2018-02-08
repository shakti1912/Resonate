import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import UnauthorizedComponent from '../UnauthorizedComponent';
import ProtectedComponent from '../../components/ProtectedComponent';

import logo from '../../images/icon.svg';
import enter from '../../images/search.svg';
import add from '../../images/add.svg';
import home from '../../images/home.svg';
import login from '../../images/login.svg';
import profile from '../../images/user.svg';

const PROTECTED = 1, UNATHORIZED = 2, NONE = 3;

const styles = {
    "Top-Menu": {
        color: 'white',
        display: 'flex',
        justifyContent: 'space-evenly',
        backgroundColor: 'orange',
        height: 45,
        alignItems: 'center'
    },
    "Top-Menu-Link": {
        color: 'white',
        height: 35
    },
    "Top-Menu-Link-Image": {
        height: 35
    }
};

const protectedLinks = [
    {
        to: '/',
        image: home,
        type: NONE
    },
    {
        to: '/newParty',
        image: add,
        type: PROTECTED
    },
    {
        to: '/parties',
        image: enter,
        type: PROTECTED
    },
    {
        to: '/me',
        image: profile,
        type: PROTECTED
    },
    {
        to: '/login',
        image: login,
        type: UNATHORIZED
    },
    {
        to: '/logout',
        image: logo,
        type: PROTECTED
    },
];

const getLink = (link) => {
    const returnLink = <Link key={link.type === NONE && link.to} style={styles["Top-Menu-Link"]} to={link.to}><img
        style={styles["Top-Menu-Link-Image"]} src={link.image}/></Link>;

    let returnObject;

    switch (link.type) {
        case PROTECTED:
            returnObject = <ProtectedComponent key={link.to}>{returnLink}</ProtectedComponent>;
            break;
        case UNATHORIZED:
            returnObject = <UnauthorizedComponent key={link.to}>{returnLink}</UnauthorizedComponent>;
            break;
        case NONE:
            returnObject = returnLink;
            break;
    }

    return returnObject;
};

class TopMenu extends Component {
    render() {
        return (
            <div style={styles["Top-Menu"]}>
                {
                    protectedLinks.map(link => (
                        getLink(link)
                    ))
                }
            </div>
        );
    }
}

export default TopMenu;
