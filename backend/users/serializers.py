from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from .models import Post
from rest_framework import serializers

User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password']

class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.id')
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'author', 'author_name', 'title', 'description', 'video_url', 'trailer_url', 'thumbnail_url', 'cast_and_crew', 'location', 'views', 'created_at']

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}"