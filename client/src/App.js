import React, {Component} from 'react';
import './App.css';

import MyProfilePage from './pages/MyProfile';
import AllPartiesPage from './pages/AllParties';
import UserLoginPage from './pages/UserLogin';
import UserLogoutPage from './pages/UserLogout';
import NewPartyPage from './pages/NewPartyPage';
import PartyPage from './pages/Party';

import TopMenu from './components/TopMenu';
import DotMenu from './components/DotMenu';

import {
    BrowserRouter as Router,
    Route,
    Redirect
} from 'react-router-dom'
import {isLoggedIn} from "./util";


window.__server__ = window.location.href.indexOf('localhost') > -1 ? 'http://localhost' : 'http://jbox.live';

class App extends Component {
    render() {
        return (
            <div>
                <Router>
                    <div>
                        <TopMenu/>

                        <UnauthorizedRoute path="/login" component={UserLoginPage}/>

                        <ProtectedRoute exact path="/" component={MyProfilePage}/>
                        <ProtectedRoute path="/me" component={MyProfilePage}/>
                        <ProtectedRoute path="/newParty" component={NewPartyPage}/>
                        <ProtectedRoute path="/parties" component={AllPartiesPage}/>
                        <ProtectedRoute path="/logout" component={UserLogoutPage}/>
                        <ProtectedRoute path="/party/:id" component={PartyPage}/>

                        <DotMenu/>
                    </div>
                </Router>
            </div>
        );
    }
}

const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        isLoggedIn()
            ? <Component {...props} />
            : <Redirect to='/login' />
    )} />
);

const UnauthorizedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        !isLoggedIn()
            ? <Component {...props} />
            : <Redirect to='/me' />
    )} />
);

export default App;
