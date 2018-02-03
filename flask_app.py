from flask import Flask
from flask import Response
from flask import Request as request
from flask import jsonify
#import database_connection as mongo
flask_app = Flask(__name__)


@flask_app.route('/')
def hello_world():
    return Response(
        'Hello world from Flask!\n',
        mimetype='text/plain'
    )

@flask_app.route('/api/login/spotify/')
def sign_up():
    request.args['code']
    d = {}
    d.code = request.args['code']
    return d.code


#app = flask_app.wsgi_app

if __name__ == '__main__':
    flask_app.run(debug=True, host='0.0.0.0')
