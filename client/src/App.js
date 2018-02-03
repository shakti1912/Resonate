import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import fetch from 'isomorphic-fetch';


import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'


import YouTube from 'react-youtube';

const party = {
    name: 'Our first birthday party!',
    list: [
        {
            name: 'Post Malone - rockstar ft. 21 Savage',
            link: 'https://www.youtube.com/watch?v=UceaB4D0jpo',
            score: 4
        },
        {
            name: 'Post Malone - Congratulations ft. Quavo',
            link: 'https://www.youtube.com/watch?v=SC4xMk98Pdc',
            score: 6
        },
        {
            name: 'Flatbush Zombies - Palm Trees Music Video (Prod. By The Architect)',
            link: 'https://www.youtube.com/watch?v=kfzRXseSBIM',
            score: 8
        },
        {
            name: 'Flatbush ZOMBiES - \'This Is It\' (Music Video)',
            link: 'https://www.youtube.com/watch?v=pxplVYIN1Fc',
            score: 3
        }
    ]
};

const getYouTubeVideoId = (link) => {
    const re = /\?v=(.*)/;

    return re.exec(link)[1] || 0 / 0;
};

class Player extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentSong: 0,
            list: party.list
        }
    }

    render() {

        const opts = {
            height: '390',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 1
            }
        };

        return (
            <div className="App">

                {/*<header className="App-header">*/}
                {/*<img src={logo} className="App-logo" alt="logo" />*/}
                {/*<h1 className="App-title">Welcome to React</h1>*/}
                {/*</header>*/}
                {/*<p className="App-intro">*/}
                {/*To get started, edit <code>src/App.js</code> and save to reload.*/}
                {/*</p>*/}

                <div className={'Header'}>{party.name}</div>
                <div className={'List'}>
                    {this.state.list.map(song => (<div
                        className={song.name === this.state.list[this.state.currentSong].name ? 'currentSong' : ''}>{song.name}</div>))}
                </div>
                <div className={'Player'}>
                    <YouTube
                        videoId={getYouTubeVideoId(this.state.list[this.state.currentSong].link)}
                        opts={opts}
                        onReady={this._onReady}
                        onEnd={() => {

                            let newList = this.state.list.slice();
                            newList.push(newList.shift());

                            this.setState((prevState) => ({
                                currentSong: prevState.currentSong,
                                list: newList
                            }));
                        }}
                    />
                </div>

            </div>
        );
    }
}

class Login extends Component {
    render() {
        return (
            <div onClick={() => {

                // fetch('https://accounts.spotify.com/authorize?client_id=f593d8a2348948c5a1fb8dea345ff106&response_type=code&redirect_uri=http://18.221.244.159/api/login/spotify', { mode: 'no-cors' })
                //     .then(function(response) {
                //         if (response.status >= 400) {
                //             throw new Error("Bad response from server");
                //         }
                //         return response.json();
                //     })
                //     .then(function(stories) {
                //         console.log(stories);
                //     });

            }}>Login

                <a href='https://accounts.spotify.com/authorize?client_id=f593d8a2348948c5a1fb8dea345ff106&response_type=code&redirect_uri=http://18.221.244.159/api/login/spotify'>login</a>

            </div>
        );
    }
}

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={Player}/>
                    <Route path="/login" component={Login}/>
                </div>
            </Router>
        );
    }
}

export default App;
