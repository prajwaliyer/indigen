from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from .models import Post
from rest_framework import serializers

User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ['id', 'email', 'first_name', 'last_name','password']

class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.id')

    class Meta:
        model = Post
        fields = ['id', 'author', 'content', 'video_url', 'trailer_url', 'cast_and_crew', 'created_at']

