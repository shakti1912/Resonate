from flask import Flask
from flask import Response
from flask import request
from flask import jsonify
import database_connection as conn
import requests
import base64
import urllib
import json

# import database_connection as mongo

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

flask_app = Flask(__name__)


@flask_app.route('/')
def hello_world():
    return Response(
        'Hello world from Flask!\n',
        mimetype='text/plain'
    )


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
    print "printing access token %s", access_token
    refresh_token = response_data["refresh_token"]
    token_type = response_data["token_type"]
    expires_in = response_data["expires_in"]
    conn.insert_token(access_token)
    print "from spotify end point"
    # using_access_token()

    # Auth Step 6: Use the access token to access Spotify API
    # authorization_header = {"Authorization": "Bearer {}".format(access_token)}

    # Get profile data
    # user_profile_api_endpoint = "{}/me".format(SPOTIFY_API_URL)
    # profile_response = requests.get(user_profile_api_endpoint, headers=authorization_header)
    # profile_data = json.loads(profile_response.text)

    # Get user playlist data
    # playlist_api_endpoint = "{}/playlists".format(profile_data["href"])
    # playlists_response = requests.get(playlist_api_endpoint, headers=authorization_header)
    # playlist_data = json.loads(playlists_response.text)

    # Get user tracks
    # tracks_api_endpoint = "{}/me/tracks".format(SPOTIFY_API_URL)
    # tracks_response = requests.get(tracks_api_endpoint, headers=authorization_header)
    # tracks_data = json.loads(tracks_response.text)

    # inserting token in db
    # conn.insert_token(access_token)

    # Combine profile and playlist data to display
    # display_arr = [profile_data] + playlist_data["items"]  + tracks_data['items']

    # response = Response(
    #   response=json.dumps(display_arr),
    #    status=200,
    #   mimetype='application/json'
    # )
    # print create_user(access_token, json.dumps(display_arr))
    # print response
    # return response


@flask_app.route('/api/login/spotify/testing')
def using_access_token():
    token = conn.get_users_collection().find_one()['token']

    # Auth Step 6: Use the access token to access Spotify API
    authorization_header = {"Authorization": "Bearer {}".format(token)}

    # Get profile data
    user_profile_api_endpoint = "{}/me".format(SPOTIFY_API_URL)
    profile_response = requests.get(user_profile_api_endpoint, headers=authorization_header)
    profile_data = json.loads(profile_response.text)
    print "from using_Access_token method "

    # Get user playlist data
    playlist_api_endpoint = "{}/playlists".format(profile_data["href"])
    playlists_response = requests.get(playlist_api_endpoint, headers=authorization_header)
    playlist_data = json.loads(playlists_response.text)
    # print playlist_data

    # Get user tracks
    tracks_api_endpoint = "{}/me/tracks".format(SPOTIFY_API_URL)
    tracks_response = requests.get(tracks_api_endpoint, headers=authorization_header)
    tracks_data = json.loads(tracks_response.text)
    # print tracks_data

    # Combine profile and playlist data to display
    data_dict = {}
    data_dict['profile'] = profile_data
    data_dict['playlist'] = playlist_data
    data_dict['tracks'] = tracks_data

    # display_arr = [profile_data] + playlist_data["items"]  + tracks_data['items']


    response = Response(
        response=json.dumps(data_dict),
        status=200,
        mimetype='application/json'
    )
    create_user(token, json.dumps(data_dict))

    return response


def create_user(token, r):
    resp = json.loads(r)  # resp is a dict

    user = {}
    email = resp['profile']['email']
    user['email'] = email
    user['access_token'] = token
    user['songs'] = []

    items = resp['tracks']["items"]
    print 'ITEMS TYPE: ==========================> '
    print type(items)
    for item in items:
        for key in item.keys():
            print 'KEY: ==========================> '
            print key
        print "item"
        print item
        song_name = item['track']['name']
        print song_name
        artist_name = item['track']['artists'][0]['name']  # artist name
        print song_name + ' ' + artist_name

        songs_details = {"song_name": song_name, "artist_name": artist_name}
        user['songs'].append(songs_details)

    conn.get_users_collection().insert(user)


if __name__ == '__main__':
    flask_app.run(debug=True, host='0.0.0.0', port=80)
