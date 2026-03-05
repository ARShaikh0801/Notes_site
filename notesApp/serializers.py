from rest_framework import serializers

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100)
    email    = serializers.EmailField()
    password = serializers.CharField(min_length=6, write_only=True)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class NoteSerializer(serializers.Serializer):
    id        = serializers.CharField(read_only=True)
    title     = serializers.CharField(max_length=200)
    content   = serializers.CharField()
    is_pinned = serializers.BooleanField(default=False)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)