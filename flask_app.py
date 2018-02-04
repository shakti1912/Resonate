import os
from flask import Flask, send_from_directory
from flask import Response
from flask import request
from flask import jsonify
import requests
import base64
import urllib
import json
from pathlib import Path
from flask_jwt import JWT, jwt_required, current_identity
from werkzeug.security import safe_str_cmp

#import database_connection as mongo

#  Client Keys
CLIENT_ID = "f593d8a2348948c5a1fb8dea345ff106"
CLIENT_SECRET = "ba54399bb5f14c0bb6bbcdd25088bd71"


# Spotify URLS
SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_BASE_URL = "https://api.spotify.com"
API_VERSION = "v1"
SPOTIFY_API_URL = "{}/{}".format(SPOTIFY_API_BASE_URL, API_VERSION)


# Server-side Parameters
CLIENT_SIDE_URL = "http://localhost"
PORT = 80
REDIRECT_URI = "{}/api/login/spotify".format(CLIENT_SIDE_URL)
SCOPE = "playlist-modify-public playlist-modify-private user-read-private user-read-birthdate user-read-email user-library-read"
STATE = ""
SHOW_DIALOG_bool = True
SHOW_DIALOG_str = str(SHOW_DIALOG_bool).lower()

class User(object):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __str__(self):
        return "User(id='%s')" % self.id

users = [
    User(1, 'user1', 'abcxyz'),
    User(2, 'user2', 'abcxyz'),
]

username_table = {u.username: u for u in users}
userid_table = {u.id: u for u in users}


def authenticate(username, password):
    user = username_table.get(username, None)
    if user and safe_str_cmp(user.password.encode('utf-8'), password.encode('utf-8')):
        return user
    # return 1

def identity(payload):
    user_id = payload['identity']
    return userid_table.get(user_id, None)
    # return 1

flask_app = Flask(__name__)

flask_app.config['SECRET_KEY'] = 'super-secret'

jwt = JWT(flask_app, authenticate, identity)

@flask_app.route('/<path:filename>')
def serve_static(filename):
    root_dir = os.path.dirname(os.getcwd())

    my_file = Path(os.path.join(root_dir, 'Resonate', 'client', 'build') + filename)
    if my_file.is_file():
        return send_from_directory(os.path.join(root_dir, 'Resonate', 'client', 'build'), filename)
    else:
        return send_from_directory(os.path.join(root_dir, 'Resonate', 'client', 'build'), 'index.html')

@flask_app.route('/static/css/<path:filename>')
def serve_static_static_css(filename):
    root_dir = os.path.dirname(os.getcwd())
    return send_from_directory(os.path.join(root_dir, 'Resonate', 'client', 'build', 'static', 'css'), filename)

@flask_app.route('/static/js/<path:filename>')
def serve_static_static_js(filename):
    root_dir = os.path.dirname(os.getcwd())
    return send_from_directory(os.path.join(root_dir, 'Resonate', 'client', 'build', 'static', 'js'), filename)

@flask_app.route('/static/media/<path:filename>')
def serve_static_static_media(filename):
    root_dir = os.path.dirname(os.getcwd())
    return send_from_directory(os.path.join(root_dir, 'Resonate', 'client', 'build', 'static', 'media'), filename)

@flask_app.route('/party/<id>')
def get_party(id):
    #Get party from DB
    return id

@flask_app.route('/party', methods=['POST'])
@jwt_required()
def create_party():
    #Add party to DB
    return '%s' % current_identity.id + request.data



@flask_app.route('/api/login/spotify')
def sign_up():
    c = request.args.get('code')
    d = {}
    d['code'] = c

    # Auth Step 4: Requests refresh and access tokens
    auth_token = request.args['code']
    code_payload = {
        "grant_type": "authorization_code",
        "code": str(auth_token),
        "redirect_uri": REDIRECT_URI
    }
    base64encoded = base64.b64encode("{}:{}".format(CLIENT_ID, CLIENT_SECRET))
    headers = {"Authorization": "Basic {}".format(base64encoded)}
    post_request = requests.post(SPOTIFY_TOKEN_URL, data=code_payload, headers=headers)

    print REDIRECT_URI
    print base64encoded

    # Auth Step 5: Tokens are Returned to Application
    response_data = json.loads(post_request.text)
    print response_data
    access_token = response_data["access_token"]
    print access_token
    refresh_token = response_data["refresh_token"]
    token_type = response_data["token_type"]
    expires_in = response_data["expires_in"]

    # Auth Step 6: Use the access token to access Spotify API
    authorization_header = {"Authorization": "Bearer {}".format(access_token)}

    # Get profile data
    user_profile_api_endpoint = "{}/me".format(SPOTIFY_API_URL)
    profile_response = requests.get(user_profile_api_endpoint, headers=authorization_header)
    profile_data = json.loads(profile_response.text)

    # Get user playlist data
    playlist_api_endpoint = "{}/playlists".format(profile_data["href"])
    playlists_response = requests.get(playlist_api_endpoint, headers=authorization_header)
    playlist_data = json.loads(playlists_response.text)

    # Get user tracks
    tracks_api_endpoint = "{}/me/tracks".format(SPOTIFY_API_URL)
    tracks_response = requests.get(tracks_api_endpoint, headers=authorization_header)
    tracks_data = json.loads(tracks_response.text)




    # Combine profile and playlist data to display
    display_arr = [profile_data] + playlist_data["items"]  + tracks_data['items']
    response = Response(
        response=json.dumps(display_arr),
        status=200,
        mimetype='application/json'
    )
    # print create_user(access_token, json.dumps(display_arr))
   # print response
    return response

# @flask_app.route()
def create_user(token, r):
    resp = json.loads(r)[0]
    user = {}
    email = resp[0]['email']
    user['email'] = email
    user['access_token'] = token
    user['songs'] = []
    x = 4
    while x < len(resp):
        song_name = resp[x]["track"]['name'] # name of the track
        artist_name = resp[x]["track"]['artists']['name'] # artist name
        songs_details = {song_name :song_name, artist_name:artist_name}
        user['songs'].append(songs_details)

    return user

@flask_app.route('/')
def serve_static_index():
    root_dir = os.path.dirname(os.getcwd())
    return send_from_directory(os.path.join(root_dir, 'Resonate', 'client', 'build'), 'index.html')

@flask_app.route('/protected')
@jwt_required()
def protected():
    return '%s' % current_identity

if __name__ == '__main__':
    flask_app.run(debug=True, host='0.0.0.0', port=80)
