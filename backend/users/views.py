from django.contrib.auth import get_user_model
from rest_framework.response import Response
from .serializers import UserCreateSerializer, PostSerializer
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from .models import Post
from rest_framework.permissions import AllowAny


@api_view(['GET'])
def users_view(request):
    users = get_user_model().objects.all()
    serializer = UserCreateSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_posts(request, user_id):
    posts = Post.objects.filter(author__id=user_id)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_post(request):
    print(request.data)
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)