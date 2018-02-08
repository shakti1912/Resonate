import React, {Component} from 'react';
import {login} from "../../util";

const spotifyLoginPicture  = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/2000px-Spotify_logo_with_text.svg.png';
const getSpotifyServerURL = (code) => {
    return `${window.__server__}/api/login/spotify?code=${code}`;
};
const dropUrlParameters = () => {
    window.location.href = `${window.__server__}/login`;
};

class UserLogin extends Component {
    componentDidMount() {
        const regex = /code=(.*)/;

        const code = window.location.href.match(regex) ? window.location.href.match(regex)[1] : undefined;

        if (code) {

            this.setState({loader: true});

            //console.log(getSpotifyServerURL(code));

            fetch(getSpotifyServerURL(code))
                .then(result => (result.json()))
                .then(user => {
                    //console.log(user);
                    dropUrlParameters();
                    login(user);
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
                {
                    this.state.loader
                    ? <div style={{marginTop: '50%'}}>

                        <div className="loader">
                            <svg className="circular" viewBox="25 25 50 50">
                                <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="2"
                                        strokeMiterlimit="10"/>
                            </svg>
                        </div>

                        <div style={
                            {
                                color: 'white',
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }
                        }>
                            Loading your credentials
                        </div>

                    </div>
                    : <div>

                        <div className={'Header'}><h1>Connect your music libraries</h1></div>

                        <div style={
                            {
                                textAlign: 'center',
                                marginTop: 25
                            }
                        }
                             onClick={() => {
                                 window.location.href = `https://accounts.spotify.com/authorize?client_id=f593d8a2348948c5a1fb8dea345ff106&scope=user-read-private user-read-email user-library-read&response_type=code&redirect_uri=${window.__server__}/login`;
                             }}>

                            <img width={'100px'}
                                 src={spotifyLoginPicture}/>

                        </div>

                    </div>
                }
            </div>
        );
    }
}

export default UserLogin;
