import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import fetch from 'isomorphic-fetch';
import {withStyles} from 'material-ui/styles';
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import Paper from 'material-ui/Paper';

import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect
} from 'react-router-dom'


import YouTube from 'react-youtube';

import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';

const theme = createMuiTheme({
    palette: {
        type: 'dark', // Switching the dark mode on is a single property value change.
    },
});

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
        },
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
        },
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
            <div className="App" style={{display: 'flex', flexDirection: 'column'}}>

                {/*<header className="App-header">*/}
                {/*<img src={logo} className="App-logo" alt="logo" />*/}
                {/*<h1 className="App-title">Welcome to React</h1>*/}
                {/*</header>*/}
                {/*<p className="App-intro">*/}
                {/*To get started, edit <code>src/App.js</code> and save to reload.*/}
                {/*</p>*/}

                <div className={'Header'}><h1>{party.name}</h1></div>
                <div className={'List'}>
                    <Paper>
                        <Table>
                            <TableBody>
                                {this.state.list.map((song, index) => (
                                    <TableRow key={song.name + index}>
                                        <TableCell
                                            className={index === 0 ? 'currentSong' : ''}>{song.name}>{song.name}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>

                    {/*{this.state.list.map(song => (<div*/}
                    {/*className={song.name === this.state.list[this.state.currentSong].name ? 'currentSong' : ''}>{song.name}</div>))}*/}
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
    componentDidMount() {
        const regex = /code=(.*)/;

        const code = window.location.href.match(regex) ? window.location.href.match(regex)[1] : undefined;

        console.log(code);

        if (code) {

            fetch(`http://localhost/api/login/spotify?code=${code}`)
                .then(function (response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }

                    console.log(response);
                    return response.json();
                })
                .then(function (token) {

                    window.location.href = `http://localhost:3000/login`;

                    localStorage.setItem('auth', JSON.stringify(token));

                    console.log(token);
                });
        }
    }

    render() {
        return (
            <div>
                {!localStorage.auth ? <div>

                    <div className={'Header'}><h1>Connect your music libraries</h1></div>

                    <div style={{textAlign: 'center', marginTop: 25}} onClick={() => {

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

                        window.location.href = `https://accounts.spotify.com/authorize?client_id=f593d8a2348948c5a1fb8dea345ff106&scope=user-read-private user-read-email user-library-read&response_type=code&redirect_uri=${window.location.href}`;


                    }}>

                        <img width={'100px'}
                             src={'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/2000px-Spotify_logo_with_text.svg.png'}/>

                    </div>

                </div> : <div>
                    <div className={'Header'} onClick={() => {
                        localStorage.removeItem('auth');
                        window.location.reload();
                    }}><h1>Log out</h1></div>
                </div>
                }
            </div>
        );
    }
}

class UserPage extends Component {
    render() {
        return (
            <div>
                {localStorage.auth ? <div>

                    <div style={{color: 'white'}}>Logged in as {JSON.parse(localStorage.auth).email}</div>

                    <div style={{color: 'white'}} onClick={() => {

                        fetch('http://localhost/party', {
                            method: 'post',
                            headers: {
                                'Authorization': 'JWT '+ JSON.stringify(localStorage.auth).token
                            }
                        })
                            .then(function (response) {
                                if (response.status >= 400) {
                                    throw new Error("Bad response from server");
                                }

                                console.log(response);
                                return response.json();
                            })
                            .then(function (token) {
                                console.log(token);
                            });

                    }}>Add new party</div>

                </div> : <Redirect to={'/login'}/>
                }
            </div>
        );
    }
}

class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>

                <Router>
                    <div>
                        <Route exact path="/" component={Player}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/me" component={UserPage}/>
                    </div>
                </Router>

                {localStorage.auth &&
                <div style={{color: 'white'}}>Logged in as {JSON.parse(localStorage.auth).email}</div>}

            </MuiThemeProvider>
        );
    }
}

export default App;
