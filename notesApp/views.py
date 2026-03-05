from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User, Note
from .serializers import RegisterSerializer, LoginSerializer, NoteSerializer
from .utils import generate_token, decode_token
import datetime


def get_current_user(request):
    """Extract user from JWT token in Authorization header"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None, 'No token provided'
    token = auth_header.split(' ')[1]
    payload, error = decode_token(token)
    if error:
        return None, error
    try:
        user = User.objects.get(id=payload['user_id'])
        return user, None
    except User.DoesNotExist:
        return None, 'User not found'


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data = serializer.validated_data

        if User.objects(username=data['username']).first():
            return Response({'error': 'Username already exists'}, status=400)
        if User.objects(email=data['email']).first():
            return Response({'error': 'Email already exists'}, status=400)

        user = User(username=data['username'], email=data['email'])
        user.set_password(data['password'])
        print(user.id)
        token = generate_token(user.id, user.username)
        return Response({'token': token, 'username': user.username}, status=201)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data = serializer.validated_data
        user = User.objects(username=data['username']).first()

        if not user or not user.check_password(data['password']):
            return Response({'error': 'Invalid credentials'}, status=401)

        token = generate_token(user.id, user.username)
        return Response({'token': token, 'username': user.username})


class NoteListCreateView(APIView):
    def get(self, request):
        user, error = get_current_user(request)
        if error:
            return Response({'error': error}, status=401)

        notes = Note.objects(user=user.username).order_by('-is_pinned', '-created_at')
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

    def post(self, request):
        user, error = get_current_user(request)
        if error:
            return Response({'error': error}, status=401)

        serializer = NoteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data = serializer.validated_data
        note = Note(
            user=user.username,
            title=data['title'],
            content=data['content'],
            is_pinned=data.get('is_pinned', False)
        )
        note.save()
        return Response(NoteSerializer(note).data, status=201)


class NoteDetailView(APIView):
    def patch(self, request, note_id):
        user, error = get_current_user(request)
        if error:
            return Response({'error': error}, status=401)

        try:
            note = Note.objects.get(id=note_id, user=user.username)
        except Note.DoesNotExist:
            return Response({'error': 'Note not found'}, status=404)

        data = request.data
        if 'title' in data:
            note.title = data['title']
        if 'content' in data:
            note.content = data['content']
        if 'is_pinned' in data:
            note.is_pinned = data['is_pinned']

        note.updated_at = datetime.datetime.now()
        note.save()
        return Response(NoteSerializer(note).data)

    def delete(self, request, note_id):
        user, error = get_current_user(request)
        if error:
            return Response({'error': error}, status=401)

        try:
            note = Note.objects.get(id=note_id, user=user.username)
        except Note.DoesNotExist:
            return Response({'error': 'Note not found'}, status=404)

        note.delete()
        return Response({'message': 'Note deleted'}, status=204)
