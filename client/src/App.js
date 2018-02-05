import React, {Component} from 'react';
import logo from './icon.svg';
import enter from './search.svg';
import add from './add.svg';
import home from './home.svg';
import login from './login.svg';
import profile from './user.svg';
import menu from './menu.svg';
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

const server = 'http://jbox.live';

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

    if (!re.exec(link)[1]) {

        console.log('https://www.youtube.com/watch?v=' + link);

        return 'https://www.youtube.com/watch?v=' + link

    } else {
        return re.exec(link)[1];
    }
};

class Player extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentSong: 0,
            list: []
        };

        this.getParty = (id) => {

            console.log(this);

            if (id) {
                fetch(`${server}/api/party/${id}`, {
                    headers: {
                        'Authorization': 'JWT ' + JSON.parse(localStorage.auth).token
                    }
                })
                    .then((response) => {
                        if (response.status >= 400) {
                            throw new Error("Bad response from server");
                        }

                        return response.json();
                    })
                    .then((party) => {

                        console.log(party.party.songs.songs);

                        this.setState({
                            list: party.party.songs.songs
                        });
                    });
            }
        };

        this.getParty(props.match.params.id);
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
                                    <TableRow key={song._id + index}>
                                        <TableCell
                                            className={index === 0 ? 'currentSong' : ''}>{song.artist_name}>{song.song_name}>{song.link}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>

                    {/*{this.state.list.map(song => (<div*/}
                    {/*className={song.name === this.state.list[this.state.currentSong].name ? 'currentSong' : ''}>{song.name}</div>))}*/}
                </div>
                <div className={'Player'}>
                    {this.state.list.length > 0 && <YouTube
                        videoId={this.state.list[this.state.currentSong].link}
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
                    />}
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

            this.setState({loader: true});

            fetch(`${server}/api/login/spotify?code=${code}`)
                .then(function (response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }

                    console.log(response);
                    return response.json();
                })
                .then(function (token) {

                    window.location.href = `${server}/login`;

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

                    <div style={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>Loading your credentials</div>

                </div> : <div>
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
                        {/*<div className={'Header'} onClick={() => {*/}
                        {/*localStorage.removeItem('auth');*/}
                        {/*window.location.reload();*/}
                        {/*}}><h1>Log out</h1></div>*/}
                        <Redirect to={'me'}/>
                    </div>
                    }
                </div>
                }
            </div>
        );
    }
}

class AddPartyPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newPartyId: null
        };
    }

    render() {
        return (
            <div>
                <label style={{color: 'white'}} htmlFor="party_name">Party name</label>
                <input type="text" id="party_name"/>

                <div style={{color: 'white'}} onClick={() => {

                    const parentObj = this;

                    fetch(`${server}/api/party`, {
                        method: 'post',
                        headers: {
                            'Authorization': 'JWT ' + JSON.parse(localStorage.auth).token
                        },
                        body: JSON.stringify({
                            name: 'New party'
                        })
                    })
                        .then(function (response) {
                            if (response.status >= 400) {
                                throw new Error("Bad response from server");
                            }

                            console.log(response);
                            return response.json();
                        })
                        .then(function (token) {

                            parentObj.setState({
                                newPartyId: token.response.id
                            });

                            console.log(token);
                        });

                }}>Add new party
                </div>

                {this.state.newPartyId && <Redirect to={`/party/${this.state.newPartyId}`}/>}
            </div>
        );
    }
}

class UserPage extends Component {
    render() {
        return (
            <div>
                {localStorage.auth ? <div>

                    {/*<div style={{color: 'white'}}>Logged in as {JSON.parse(localStorage.auth).email}</div>*/}

                    <div style={{
                        height: 120,
                        width: 120,
                        borderRadius: '50%',
                        lineHeight: '120px',
                        fontSize: '50px',
                        backgroundColor: 'orange',
                        textAlign: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        margin: 'auto',
                        marginTop: 50
                    }}>
                        {JSON.parse(localStorage.auth).email.charAt(0).toUpperCase()}
                    </div>

                    {localStorage.auth &&
                    <div style={{color: 'white'}}>Logged in as {JSON.parse(localStorage.auth).email}</div>}

                </div> : <Redirect to={'/login'}/>
                }
            </div>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false
        }
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Router>
                    <div>
                        <Header/>
                        <Route exact path="/" component={Player}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/me" component={UserPage}/>
                        <Route path="/newParty" component={AddPartyPage}/>
                        <Route path="/party/:id" component={Player}/>
                    </div>
                </Router>
                {/*<div className="menu">*/}
                {/*<div className={(this.state.visible ? "visible " : "") + this.props.alignment}>{this.props.children}</div>*/}
                {/*</div>*/}
                <div style={{
                    position: 'fixed',
                    right: 25,
                    bottom: 25,
                    backgroundColor: 'orange',
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    textAlign: 'center',
                    lineHeight: '44px',
                    display: 'inline-block',
                    verticalAlign: 'middle'
                }}
                     onClick={() => {
                         this.setState(prevState => ({visible: !prevState.visible}));
                     }}
                ><img style={{marginTop: 10}} height='30' src={menu}/></div>
                <div className={'theMenu ' + (this.state.visible ? 'out' : '')} onClick={() => {
                    this.setState(prevState => ({visible: !prevState.visible}));
                }}></div>
            </MuiThemeProvider>
        );
    }
}

class Header extends Component {
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
                {localStorage.auth &&
                <Link style={{color: 'white', height: 35}} to={'/newParty'}><img height="35" src={add}/></Link>}
                {localStorage.auth &&
                <Link style={{color: 'white', height: 35}} to={'/'}><img height="35" src={enter}/></Link>}
                {localStorage.auth &&
                <Link style={{color: 'white', height: 35}} to={'/me'}><img height="35" src={profile}/></Link>}
                {!localStorage.auth &&
                <Link style={{color: 'white', height: 35}} to={'/login'}><img height="35" src={login}/></Link>}
                {localStorage.auth && <span onClick={() => {
                    localStorage.removeItem('auth');
                    window.location.reload();
                }} style={{textDecoration: 'underline', cursor: 'pointer', height: 35}}><img height="35"
                                                                                             src={logo}/></span>}
            </div>
        );
    }
}

export default App;
