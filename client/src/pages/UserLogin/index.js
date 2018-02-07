import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import {isLoggedIn} from "../../util";

class UserLogin extends Component {
    componentDidMount() {
        const regex = /code=(.*)/;

        const code = window.location.href.match(regex) ? window.location.href.match(regex)[1] : undefined;

        console.log(code);

        if (code) {

            this.setState({loader: true});

            fetch(`${window.__server__}/api/login/spotify?code=${code}`)
                .then(function (response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }

                    console.log(response);
                    return response.json();
                })
                .then(function (token) {

                    window.location.href = `${window.__server__}/login`;

                    localStorage.setItem('auth', JSON.stringify(token));

                    console.log(token);
                });
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            loader: false
        }
    }

    render() {
        return (
            <div>
                {this.state.loader ? <div style={{marginTop: '50%'}}>

                    <div className="loader">
                        <svg className="circular" viewBox="25 25 50 50">
                            <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="2"
                                    strokeMiterlimit="10"/>
                        </svg>
                    </div>

                    <div style={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>Loading your credentials
                    </div>

                </div> : <div>
                    {!isLoggedIn() ? <div>

                        <div className={'Header'}><h1>Connect your music libraries</h1></div>

                        <div style={{textAlign: 'center', marginTop: 25}} onClick={() => {

                            window.location.href = `https://accounts.spotify.com/authorize?client_id=f593d8a2348948c5a1fb8dea345ff106&scope=user-read-private user-read-email user-library-read&response_type=code&redirect_uri=${window.location.href}`;

                        }}>

                            <img width={'100px'}
                                 src={'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/2000px-Spotify_logo_with_text.svg.png'}/>

                        </div>

                    </div> : <div>
                        <Redirect to={'me'}/>
                    </div>
                    }
                </div>
                }
            </div>
        );
    }
}

export default UserLogin;
