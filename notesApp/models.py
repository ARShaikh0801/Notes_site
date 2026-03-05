from mongoengine import Document, StringField, BooleanField, DateTimeField, ReferenceField, EmailField
from django.contrib.auth.hashers import make_password, check_password
import datetime

class User(Document):
    username   = StringField(required=True, unique=True)
    email      = EmailField(required=True, unique=True)
    password   = StringField(required=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self.save()

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    meta = {'collection': 'users'}


class Note(Document):
    user       = StringField(required=True)
    title      = StringField(required=True, max_length=200)
    content    = StringField(required=True)
    is_pinned  = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.datetime.now())
    updated_at = DateTimeField(default=datetime.datetime.now())

    meta = {'collection': 'notes'}
