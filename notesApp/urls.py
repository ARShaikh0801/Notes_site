from django.urls import path
from . import views

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view()),
    path('auth/login/',    views.LoginView.as_view()),
    path('notes/',         views.NoteListCreateView.as_view()),
    path('notes/<str:note_id>/', views.NoteDetailView.as_view()),
]