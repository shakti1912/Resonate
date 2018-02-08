# connect to database and get something

import pymongo
import os

print os.environ

DATABASE_USERNAME = os.environ['JBOX_DATABASE_USERNAME']
DATABASE_PASSWORD = os.environ['JBOX_DATABASE_PASSWORD']
DATABASE_ADDRESS = os.environ['JBOX_DATABASE_ADDRESS']

print 'mongodb://' + DATABASE_USERNAME + ':' + DATABASE_PASSWORD + '@' + DATABASE_ADDRESS

connection = pymongo.MongoClient('mongodb://' + DATABASE_USERNAME + ':' + DATABASE_PASSWORD + '@' + DATABASE_ADDRESS + '/music')
print connection

db = connection.music
dict = db.test.find()


def get_connection():
    return connection


def get_database():
    return db


def get_users_collection():
    return db.users


def get_parties_collection():
    return db.parties


def insert_token(email, token):
    print "inserting token"
    db.users.insert({
        "email": email,
        "token": token,
        "songs": []
    })
