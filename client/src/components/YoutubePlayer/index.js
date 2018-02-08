import React, {Component} from 'react';
import YouTube from 'react-youtube';

const opts = {
    height: '390',
    width: '640',
    playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
    }
};

class YoutubePlayer extends Component {
    render() {
        return (
            <div className={'Player'}>
                <YouTube
                    videoId={this.props.song}
                    opts={opts}
                    onReady={this._onReady}
                    onEnd={this.props.onEnd}
                />
            </div>
        );
    }
}

export default YoutubePlayer;
