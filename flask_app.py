from flask import Flask
from flask import Response
from flask import request
from flask import jsonify
#import database_connection as mongo
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

    return jsonify(
        code=d['code']
    )
    #return Response(
     #   'code from Flask!\n',
     #   mimetype='application/json'
    #)


#app = flask_app.wsgi_app

if __name__ == '__main__':
    flask_app.run(debug=True, host='0.0.0.0', port=80)
