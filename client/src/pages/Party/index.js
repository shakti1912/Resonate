import React, {Component} from 'react';
import {getAuthorizedJson, getLoggedInUser, postAuthorized} from "../../util";
import YoutubePlayer from "../../components/YoutubePlayer";

const styles = {
    'Header-Styles': {
        width: '100%',
        backgroundColor: 'orange',
        height: 25,
        color: 'white'
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

            const address = id
                ? `${window.__server__}/api/party/${id}`
                : `${window.__server__}/api/me/info`;

            getAuthorizedJson(address)
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

        this.onSongEnd = () => {
            let newList = this.state.list.slice();

            newList.push(newList.shift());

            this.setState((prevState) => ({
                currentSong: prevState.currentSong,
                list: newList
            }));
        }
    }

    render() {

        const getButton = (address, text) => {
            return (<div style={styles['Header-Button']}
                         onClick={() => {
                             postAuthorized(address)
                                 .then((json) => {
                                     console.log(json);
                                 });
                         }}>
                {text}
            </div>)
        };

        return (
            <div className="App">

                {
                    this.state.party
                    && <div>
                        {this.state.host} or {getLoggedInUser().email}

                        <div className={'Header'}>
                            <h1>{this.state.partyName || `${this.state.host}'s party`}</h1>

                            {
                                this.props.match
                                && getButton(`${window.__server__}/api/party/${this.props.match.params.id}/join`, 'Join party')
                            }

                            {
                                this.props.match
                                && getButton(`${window.__server__}/api/party/${this.props.match.params.id}/leave`, 'Leave party')
                            }
                        </div>

                        <div className={'List'}>
                            {
                                this.state.list.map((song, index) => (
                                    <div key={song.link + index}
                                         className={index === 0 ? 'currentSong' : ''}>
                                        {song.artist_name}>{song.song_name}>{song.link}
                                    </div>
                                ))
                            }
                        </div>

                        <YoutubePlayer
                            song={this.state.list[this.state.currentSong].link}
                            onEnd={this.onSongEnd}
                        />

                    </div>
                }
            </div>
        );
    }
}


export default Party;
