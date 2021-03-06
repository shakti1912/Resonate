import os

import datetime
from flask import Flask, send_from_directory
from flask import Response
from flask import request
from flask import jsonify
import database_connection as conn
import requests
import base64
import urllib
import json
import jwt
import threading
import httplib
import timeit

from pathlib import Path
from flask_cors import CORS, cross_origin

from flask_jwt import JWT, jwt_required, current_identity
from werkzeug.security import safe_str_cmp

from bson.objectid import ObjectId
from bson.json_util import dumps
import os

import sys

server = sys.argv[1:][0] if sys.argv[1:] != [] else 'http://jbox.live'
print server

#  Client Keys
CLIENT_ID = os.environ['JBOX_SPOTIFY_CLIENT_ID']  # f593d8a2348948c5a1fb8dea345ff106"
CLIENT_SECRET = os.environ['JBOX_SPOTIFY_CLIENT_SECRET']  # "ba54399bb5f14c0bb6bbcdd25088bd71"
YOUTUBE_API_KEY = os.environ['JBOX_YOUTUBE_API_KEY']
# Spotify URLS
SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_BASE_URL = "https://api.spotify.com"
API_VERSION = "v1"
SPOTIFY_API_URL = "{}/{}".format(SPOTIFY_API_BASE_URL, API_VERSION)

# Server-side Parameters
CLIENT_SIDE_URL = server
PORT = 80
REDIRECT_URI = "{}/login".format(CLIENT_SIDE_URL)
SCOPE = "user-read-private user-read-birthdate user-read-email user-library-read"
STATE = ""
SHOW_DIALOG_bool = True
SHOW_DIALOG_str = str(SHOW_DIALOG_bool).lower()

flask_app = Flask(__name__)
CORS(flask_app)
flask_app.config['SECRET_KEY'] = os.environ['JBOX_JWT_SECRET_KEY']  # 'dick'


def authenticate(username, password):
    return 1


def identity(payload):
    user_id = payload['email']
    return user_id


jwt_auth = JWT(flask_app, authenticate, identity)


@flask_app.route('/<path:filename>')
def serve_static(filename):
    root_dir = os.path.dirname(os.path.realpath(__file__))

    my_file = Path(os.path.join(root_dir, 'client', 'build') + filename)
    if my_file.is_file():
        return send_from_directory(os.path.join(root_dir, 'client', 'build'), filename)
    else:
        return send_from_directory(os.path.join(root_dir, 'client', 'build'), 'index.html')


@flask_app.route('/static/css/<path:filename>')
def serve_static_static_css(filename):
    root_dir = os.path.dirname(os.path.realpath(__file__))
    return send_from_directory(os.path.join(root_dir, 'client', 'build', 'static', 'css'), filename)


@flask_app.route('/static/js/<path:filename>')
def serve_static_static_js(filename):
    root_dir = os.path.dirname(os.path.realpath(__file__))
    return send_from_directory(os.path.join(root_dir, 'client', 'build', 'static', 'js'), filename)


@flask_app.route('/static/media/<path:filename>')
def serve_static_static_media(filename):
    root_dir = os.path.dirname(os.path.realpath(__file__))
    return send_from_directory(os.path.join(root_dir, 'client', 'build', 'static', 'media'), filename)


@flask_app.route('/api/party/<id>')
@jwt_required()
def get_party(id):
    # Get party from DB

    # 1. Use current_identity to see if the user already assigned to the party (DB -> party -> people)
    # 2. If the user is in the party - proceed normally

    person_cursor = conn.get_parties_collection().find({"people": {"$in": current_identity}})

    if person_cursor is not None:

        partyCursor = conn.get_parties_collection().find({'_id': ObjectId(id)},
                                                         {"_id": 1, "songs": 1, "name": 1}).limit(1)

        if partyCursor.count() > 0:

            party = partyCursor.__getitem__(0)

            response = Response(
                response=dumps({"party": party}),
                status=200,
                mimetype='application/json'
            )

        else:

            response = Response(
                response=json.dumps({"error": "Requested party does not exist"}),
                status=400,
                mimetype='application/json'
            )

        return response

    else:
        user = conn.get_users_collection().find({"email": current_identity})
        user_songs = user["songs"]
        party_cursor = conn.get_parties_collection().find({'_id': ObjectId(id)},
                                                          {"_id": 1, "songs": 1, "name": 1})
        if party_cursor.count() > 0:
            party = party_cursor.__getitem__(0)
            (party["songs"]["songs"]).append(user_songs)

            conn.get_users_collection().update({"email": current_identity}, {"$push": {"people": user["email"]}})

            # 3. If the user is not in the party:
            #   3a. Get users music by email
            #   3b. Add users music to the party
            #   3c. Add user to the list of people at the party


@flask_app.route('/api/me/info')
@jwt_required()
def get_user_info():
    # Get my information from DB

    userCursor = conn.get_users_collection().find({'email': '%s' % current_identity},
                                                  {"songs": 1, "name": 1, "_id": 1}).limit(1)

    if userCursor.count() > 0:

        user = userCursor.__getitem__(0)

        response = Response(
            response=dumps({"user": user}),
            status=200,
            mimetype='application/json'
        )

    else:

        response = Response(
            response=json.dumps({"error": "Something went wrong. Please try again."}),
            status=400,
            mimetype='application/json'
        )

    return response


@flask_app.route('/api/me/parties')
@jwt_required()
def get_user_parties():
    # Get my information from DB

    partiesCursor = conn.get_parties_collection().find({'host': '%s' % current_identity},
                                                       {"_id": 1, "name": 1})

    if partiesCursor.count() > 0:

        parties = list(partiesCursor)

        response = Response(
            response=dumps({"parties": parties}),
            status=200,
            mimetype='application/json'
        )

    else:

        response = Response(
            response=json.dumps({"error": "Something went wrong. Please try again."}),
            status=400,
            mimetype='application/json'
        )

    return response


@flask_app.route('/api/party', methods=['POST'])
@jwt_required()
def create_party():
    # Add party to DB

    # 1. Add party to DB
    # {
    #   id: %auto_assigned%,
    #   name: request.data.party,
    #   host: current_identity,
    #   songs: [from host's songs]
    # }
    # 2. Add the user (current_identity) as the party host
    # 3. Return party ID

    songsCursor = conn.get_users_collection().find({'email': '%s' % current_identity}, {'songs': 1})

    songsList = songsCursor.__getitem__(0) if songsCursor.count() > 0 else []

    partyId = conn.get_parties_collection().insert({
        'name': json.loads(request.data)['name'],
        'host': '%s' % current_identity,
        'songs': songsList,
        'people': [].append(current_identity)
    })

    response = Response(
        response=json.dumps({"response": {'id': '%s' % partyId}}),
        status=200,
        mimetype='application/json'
    )

    return response


@flask_app.route('/api/parties')
@jwt_required()
def get_all_parties():
    # Add party to DB

    # 1. Add party to DB
    # {
    #   id: %auto_assigned%,
    #   name: request.data.party,
    #   host: current_identity,
    #   songs: [from host's songs]
    # }
    # 2. Add the user (current_identity) as the party host
    # 3. Return party ID

    partiesCursor = conn.get_parties_collection().find({}, {"_id": 1, "name": 1, "email": 1})

    partiesList = list(partiesCursor) if partiesCursor.count() > 0 else []

    response = Response(
        response=dumps({"parties": partiesList}),
        status=200,
        mimetype='application/json'
    )

    return response


@flask_app.route('/api/party/<id>/join', methods=['POST'])
@jwt_required()
def guest_join_party(id):
    # add current user(guest) to the party
    partyCursor = conn.get_parties_collection().find({'_id': ObjectId(id)})

    party = None

    print '-1'

    email = '%s' % current_identity

    print '-2'

    if partyCursor.count() > 0:
        party = partyCursor.__getitem__(0)

    # print list(party['people']).index('asd')

    # code you want to evaluate
    if party is not None and email not in list(party['people']):

        print '0'

        conn.get_parties_collection().update({"_id": ObjectId(id)}, {"$push": {"people": email}})

        print '1'

        userCursor = conn.get_users_collection().find({"email": email})

        print '2'

        userSongs = userCursor.__getitem__(0)['songs']

        partySongs = list(party['songs']['songs'])

        def contains(list, filter):
            for x in list:
                if filter(x):
                    return True

            return False

        for song in list(userSongs):
            if contains(partySongs, lambda x: x['link'] == song['link']):
                start_time = timeit.default_timer()
                conn.get_parties_collection().update({"_id": ObjectId(id), "songs.songs.link": song["link"]},
                                                     {'$inc': {"songs.songs.$.rank": 1}})
                elapsed = timeit.default_timer() - start_time
                print 'Elapsed %s' % elapsed
            else:
                song.pop('_id', None)
                conn.get_parties_collection().update({"_id": ObjectId(id)}, {"$push": {"songs.songs": song}})

        response = Response(
            response=dumps({"status": "User " + email + " was added to the party %s"}),
            status=200,
            mimetype='application/json'
        )

    else:
        response = Response(
            response=dumps({"status": "Party does not exist or the user is already in the party."}),
            status=404,
            mimetype='application/json'
        )

    return response


@flask_app.route('/api/party/<id>/leave', methods=['POST'])
@jwt_required()
def guest_leave_party(id):
    # add current user(guest) to the party
    partyCursor = conn.get_parties_collection().find({'_id': ObjectId(id)})

    party = None

    print '-1'

    email = '%s' % current_identity

    print '-2'

    if partyCursor.count() > 0:
        party = partyCursor.__getitem__(0)

    # print list(party['people']).index('asd')

    # code you want to evaluate
    if party is not None and email in list(party['people']):

        print '0'

        conn.get_parties_collection().update({"_id": ObjectId(id)}, {"$pull": {"people": email}})

        print '1'

        userCursor = conn.get_users_collection().find({"email": email})

        print '2'

        userSongs = userCursor.__getitem__(0)['songs']

        partySongs = list(party['songs']['songs'])

        def containsNotOwned(list, filter):
            for x in list:
                if filter(x):
                    return True

            return False

        for song in list(userSongs):
            if containsNotOwned(partySongs, lambda x: x['link'] == song['link'] and x.get('rank', 0) > 1):
                conn.get_parties_collection().update({"_id": ObjectId(id), "songs.songs.link": song["link"]},
                                                     {'$inc': {"songs.songs.$.rank": -1}})
            else:
                song.pop('_id', None)
                conn.get_parties_collection().update({"_id": ObjectId(id)}, {"$pull": {"songs.songs": song}})

        response = Response(
            response=dumps({"status": "User " + email + " was added to the party %s"}),
            status=200,
            mimetype='application/json'
        )

    else:
        response = Response(
            response=dumps({"status": "Party does not exist or the user is already in the party."}),
            status=404,
            mimetype='application/json'
        )

    return response


# returns jwt token
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

    print "REDIRECT_URI"
    print "base64encoded"

    # Auth Step 5: Tokens are Returned to Application
    response_data = json.loads(post_request.text)
    print response_data
    access_token = response_data["access_token"]
    print "printing access token %s", access_token
    refresh_token = response_data["refresh_token"]
    token_type = response_data["token_type"]
    expires_in = response_data["expires_in"]
    # conn.insert_token(access_token)
    print "from spotify end point"
    # using_access_token()

    # Auth Step 6: Use the access token to access Spotify API
    authorization_header = {"Authorization": "Bearer {}".format(access_token)}

    # Get profile data
    user_profile_api_endpoint = "{}/me".format(SPOTIFY_API_URL)
    profile_response = requests.get(user_profile_api_endpoint, headers=authorization_header)
    profile_data = json.loads(profile_response.text)
    email = profile_data['email']

    print profile_data['email']
    res = conn.get_users_collection().find({'email': email}).limit(1)
    print res.count()
    if res.count() == 0:
        conn.insert_token(email, access_token)
        t = threading.Thread(target=using_access_token, args=(email, access_token))
        t.start()

    else:
        print res
        for r in res:
            conn.get_users_collection().update_one({"email": email}, {"$set": {"token": access_token}})

    jwt_str = encode_auth_token(email)
    print jwt_str

    return_json = {"token": jwt_str, "email": email}

    response = Response(
        response=json.dumps(return_json),
        status=200,
        mimetype='application/json'
    )

    return response

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


def encode_auth_token(user_id):
    """
    Generates the Auth Token
    :return: string
    """
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1, seconds=0),
            'iat': datetime.datetime.utcnow(),
            'nbf': datetime.datetime.utcnow(),
            'email': user_id
        }
        return jwt.encode(
            payload,
            os.environ['JBOX_JWT_SECRET_KEY'],
            algorithm='HS256'
        )
    except Exception as e:

        return e


# thread function
def using_access_token(email, token):
    print token
    # Auth Step 6: Use the access token to access Spotify API
    authorization_header = {"Authorization": "Bearer {}".format(token)}

    # Get user tracks
    tracks_api_endpoint = "{}/me/tracks".format(SPOTIFY_API_URL)
    tracks_response = requests.get(tracks_api_endpoint, headers=authorization_header)
    tracks_data = json.loads(tracks_response.text)
    # print tracks_data

    # Combine profile and playlist data to display
    data_dict = {}

    data_dict['tracks'] = tracks_data

    # display_arr = [profile_data] + playlist_data["items"]  + tracks_data['items']

    response = Response(
        response=json.dumps(data_dict),
        status=200,
        mimetype='application/json'
    )
    update_songs(email, json.dumps(data_dict))

    return response


def update_songs(email, r):
    resp = json.loads(r)  # resp is a dict
    items = resp['tracks']["items"]

    songs = []

    for item in items:
        song_name = item['track']['name']

        artist_name = item['track']['artists'][0]['name']  # artist name

        t = threading.Thread(target=get_youtube_link_for_song, args=(song_name, artist_name, email))
        t.start()

        # songs_details = {"song_name": song_name, "artist_name": artist_name}

        # Fetch link in new thread

        # songs.append(songs_details)

        # conn.get_users_collection().update({"email": email}, {"$set": {"songs": songs}})


def get_youtube_link_for_song(artist_name, song_name, email):
    f = {'q': artist_name + ' ' + song_name}

    http_connection = httplib.HTTPSConnection('www.googleapis.com')
    http_connection.request('GET', '/youtube/v3/search?part=snippet&' + urllib.urlencode(
        f) + '&limit=1&key=' + YOUTUBE_API_KEY)
    response = http_connection.getresponse()
    data = response.read()  # same as r.text in 3.x
    song_link = json.loads(data)['items'][0]['id']['videoId']

    print '/youtube/v3/search?part=snippet&q=' + urllib.urlencode(
        f) + '&limit=1&key=' + YOUTUBE_API_KEY
    print song_link

    song_details = {"song_name": song_name, "artist_name": artist_name, 'link': song_link}

    conn.get_users_collection().update({"email": email}, {"$push": {"songs": song_details}})


@flask_app.route('/')
def serve_static_index():
    root_dir = os.path.dirname(os.path.realpath(__file__))
    print root_dir
    print os.path.join(root_dir, 'client', 'build')
    return send_from_directory(os.path.join(root_dir, 'client', 'build'), 'index.html')


if __name__ == '__main__':
    flask_app.run(threaded=True, debug=True, host='0.0.0.0', port=80)
    # https://stackoverflow.com/questions/14814201/can-i-serve-multiple-clients-using-just-flask-app-run-as-standalone


# order list based on rank
def reorderList():
    # conn.get_parties_collection().aggregate({"$sort": {'songs.songs.rank': 1}})
    # conn.get_parties_collection().update({"$push": {"songs.songs": {"$each": [], "$sort": {"rank": 1}}}})
    conn.get_parties_collection().update_many({}, {"$push": {"songs.songs": {"$each": [], "$sort": {"rank": 1}}}})
