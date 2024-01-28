from django.contrib.auth import get_user_model
from rest_framework.response import Response
from .serializers import UserCreateSerializer, PostSerializer
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from .models import Post, UserAccount
from rest_framework.permissions import AllowAny
import boto3
from django.conf import settings
from botocore.exceptions import NoCredentialsError
import uuid

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
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_presigned_url(request):
    s3_client = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME
    )

    file_name = request.GET.get('file_name')
    file_type = request.GET.get('file_type')
    video_type = request.GET.get('video_type', 'video')  # Default to 'video' if not specified
    unique_filename = f"{uuid.uuid4()}_{file_name}"

    key_prefix = 'trailers/' if video_type == 'trailer' else 'videos/'
    try:
        presigned_url = s3_client.generate_presigned_url('put_object',
            Params={'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                'Key': f"{key_prefix}{unique_filename}",
                'ContentType': file_type},
            ExpiresIn=3600)
        return Response({'presigned_url': presigned_url})
    except NoCredentialsError:
        return Response({'error': 'Error generating presigned URL'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def follow_user(request, user_id):
    try:
        user_to_follow = UserAccount.objects.get(id=user_id)
        request.user.following.add(user_to_follow)
        return Response({'status': 'following'})
    except UserAccount.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def unfollow_user(request, user_id):
    try:
        user_to_unfollow = UserAccount.objects.get(id=user_id)
        request.user.following.remove(user_to_unfollow)
        return Response({'status': 'unfollowed'})
    except UserAccount.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_followers(request, user_id):
    try:
        user = UserAccount.objects.get(id=user_id)
        followers = user.followers.all()
        serializer = UserCreateSerializer(followers, many=True)
        return Response(serializer.data)
    except UserAccount.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_following(request, user_id):
    try:
        user = UserAccount.objects.get(id=user_id)
        following = user.following.all()
        serializer = UserCreateSerializer(following, many=True)
        return Response(serializer.data)
    except UserAccount.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
