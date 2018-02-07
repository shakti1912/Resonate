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

import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect
} from 'react-router-dom'

import YouTube from 'react-youtube';

const server = 'http://localhost';
// const server = 'http://jbox.live';

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
            party: null,
            list: [],
            partyName: '',
            host: ''
        };

        this.getParty = (id) => {

            const address = (id ? `${server}/api/party/${id}` : `${server}/api/me/info`);

            console.log(address);

            fetch(address, {
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
                .then((json) => {

                    if (json.party) {

                        const party = json.party;

                        this.setState({
                            list: party.songs.songs,
                            partyName: party.name,
                            host: party.host,
                            party: party
                        });

                    } else {

                        console.log(json);

                        const party = json.user;

                        this.setState({
                            list: party.songs,
                            partyName: 'My songs',
                            host: '',
                            party: party
                        });

                    }
                });
        };

        if (props.match && props.match.params && props.match.params.id) {

            this.getParty(props.match.params.id);

        } else {

            this.getParty();

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

                {this.state.party &&
                <div>
                    {this.state.host} or {JSON.parse(localStorage.auth).email}
                    <div className={'Header'}><h1>{this.state.partyName || `${this.state.host}'s party`}</h1>
                        {this.props.match && <div style={{width: '100%', backgroundColor: 'orange', height: 25, color: 'white'}} onClick={() => {
                            const address = `${server}/api/party/${this.props.match.params.id}/join`;

                            console.log(address);

                            fetch(address, {
                                method: 'POST',
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
                                .then((json) => {
                                    console.log(json);
                                });
                        }}>
                            Add party
                        </div>}
                        {this.props.match && <div style={{width: '100%', backgroundColor: 'orange', height: 25, color: 'white'}} onClick={() => {
                            const address = `${server}/api/party/${this.props.match.params.id}/leave`;

                            console.log(address);

                            fetch(address, {
                                method: 'POST',
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
                                .then((json) => {
                                    console.log(json);
                                });
                        }}>
                            Leave party
                        </div>}
                    </div>
                    <div className={'List'}>
                        {this.state.list.map((song, index) => (
                            <div key={song.link + index}
                                 className={index === 0 ? 'currentSong' : ''}>{song.artist_name}>{song.song_name}>{song.link}
                            </div>
                        ))}

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
                }
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

                    <div style={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>Loading your credentials
                    </div>

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
            newPartyId: null,
            partyNameInput: ''
        };
    }

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30%'}}>

                <div style={{position: 'relative'}}>

                    <label style={{color: 'white', display: 'block', fontSize: 12, color: 'orange'}}
                           htmlFor="party_name">Party name</label>

                    <input value={this.state.partyNameInput} onChange={(e) => {
                        this.setState({partyNameInput: e.target.value});
                    }} placeholder="My favorite party" type="text" id="party_name" style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: '2px solid orange',
                        height: 25,
                        color: 'white',
                        fontSize: 16
                    }}/>

                </div>

                <div style={{marginTop: 15}}>

                    <div style={{
                        display: 'inline-block',
                        padding: '8px 21px',
                        border: '2px solid orange',
                        color: 'orange',
                        fontWeight: 'bold'
                    }} onClick={() => {

                        const parentObj = this;

                        fetch(`${server}/api/party`, {
                            method: 'post',
                            headers: {
                                'Authorization': 'JWT ' + JSON.parse(localStorage.auth).token
                            },
                            body: JSON.stringify({
                                name: this.state.partyNameInput
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

                    <Player/>

                    <AllParties mine={true}/>

                </div> : <Redirect to={'/login'}/>
                }
            </div>
        );
    }
}

class AllParties extends Component {
    constructor(props) {
        super(props);

        this.state = {
            parties: []
        };

        this.getAllParties = () => {

            const address = this.props.mine ? `${server}/api/me/parties` : `${server}/api/parties`;

            console.log(address);

            fetch(address, {
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
                .then((json) => {

                    if (json.parties) {

                        const parties = json.parties;

                        this.setState({
                            parties: parties
                        });

                    }
                });
        };

        this.getAllParties();

    }

    render() {

        return (
            <div className="App" style={{display: 'flex', flexDirection: 'column'}}>

                {/*<header className="App-header">*/}
                {/*<img src={logo} className="App-logo" alt="logo" />*/}
                {/*<h1 className="App-title">Welcome to React</h1>*/}
                {/*</header>*/}
                {/*<p className="App-intro">*/}
                {/*To get started, edit <code>src/App.js</code> and save to reload.*/}
                {/*</p>*/}

                {this.state.parties &&
                <div>
                    <div className={'Header'}><h1>{this.props.mine ? 'My parties' : 'All Parties'}</h1></div>
                    <div className={'List'}>
                        {this.state.parties.map((party, index) => (
                            <Link to={`/party/${party._id['$oid']}`}>
                                <div key={party._id['$oid']}>{party.name}
                                </div>
                            </Link>
                        ))}

                        {/*{this.state.list.map(song => (<div*/}
                        {/*className={song.name === this.state.list[this.state.currentSong].name ? 'currentSong' : ''}>{song.name}</div>))}*/}
                    </div>
                </div>
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
            <div>
                <Router>
                    <div>
                        <Header/>
                        <Route exact path="/" component={UserPage}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/me" component={UserPage}/>
                        <Route path="/newParty" component={AddPartyPage}/>
                        <Route path="/parties" component={AllParties}/>
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
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    textAlign: 'center',
                    lineHeight: '44px',
                    display: 'inline-block',
                    verticalAlign: 'middle'
                }}
                     onClick={() => {
                         this.setState(prevState => ({visible: !prevState.visible}));
                     }}
                ><img style={{marginTop: 15}} height='30' src={menu}/></div>
                <div className={'theMenu ' + (this.state.visible ? 'out' : '')} onClick={() => {
                    this.setState(prevState => ({visible: !prevState.visible}));
                }}></div>
            </div>
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
                <Link style={{color: 'white', height: 35}} to={'/parties'}><img height="35" src={enter}/></Link>}
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
