import React, {Component} from 'react';
import YouTube from 'react-youtube';
import {getLoggedInUser} from "../../util";


const getYouTubeVideoId = (link) => {
    const re = /\?v=(.*)/;

    if (!re.exec(link)[1]) {

        console.log('https://www.youtube.com/watch?v=' + link);

        return 'https://www.youtube.com/watch?v=' + link

    } else {
        return re.exec(link)[1];
    }
};

class Party extends Component {
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

            const address = (id ? `${window.__server__}/api/party/${id}` : `${window.__server__}/api/me/info`);

            console.log(address);

            fetch(address, {
                headers: {
                    'Authorization': 'JWT ' + getLoggedInUser().token
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

                {this.state.party &&
                <div>
                    {this.state.host} or {getLoggedInUser().email}
                    <div className={'Header'}><h1>{this.state.partyName || `${this.state.host}'s party`}</h1>
                        {this.props.match &&
                        <div style={{width: '100%', backgroundColor: 'orange', height: 25, color: 'white'}}
                             onClick={() => {
                                 const address = `${window.__server__}/api/party/${this.props.match.params.id}/join`;

                                 console.log(address);

                                 fetch(address, {
                                     method: 'POST',
                                     headers: {
                                         'Authorization': 'JWT ' + getLoggedInUser().token
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
                        {this.props.match &&
                        <div style={{width: '100%', backgroundColor: 'orange', height: 25, color: 'white'}}
                             onClick={() => {
                                 const address = `${window.__server__}/api/party/${this.props.match.params.id}/leave`;

                                 console.log(address);

                                 fetch(address, {
                                     method: 'POST',
                                     headers: {
                                         'Authorization': 'JWT ' + getLoggedInUser().token
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


export default Party;
