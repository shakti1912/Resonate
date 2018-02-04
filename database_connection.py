
# connect to database and get something

import pymongo
import sys


connection = pymongo.MongoClient("mongodb://18.221.244.159")

#connection = pymongo.MongoClient("mongodb://aflam:278S10thStreet@ec2-18-221-188-55.us-east-2.compute.amazonaws.com:27017")
print connection

db = connection.music
dict = db.test.find()


def get_connection():
    return connection

def get_database():
    return db

def get_users_collection():
    return db.users

def insert_token(email, token):
    print "inserting token"
    db.users.insert({
        "email" : email,
        "token" : token
    })

