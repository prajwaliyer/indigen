from django.contrib.auth import get_user_model
from rest_framework.response import Response
from .serializers import UserCreateSerializer, PostSerializer
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from .models import Post, UserAccount
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
import boto3
from django.core.mail import send_mail
from django.conf import settings
from botocore.exceptions import BotoCoreError, ClientError, NoCredentialsError
import uuid
from django.shortcuts import get_object_or_404

@api_view(['GET'])
def users_view(request):
    users = get_user_model().objects.all()
    serializer = UserCreateSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_details(request, user_id):
    user = get_object_or_404(get_user_model(), pk=user_id)
    serializer = UserCreateSerializer(user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_posts(request, user_id):
    posts = Post.objects.filter(author__id=user_id)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_post(request):
    # 3 post limit for closed beta
    user_posts_count = Post.objects.filter(author=request.user).count()
    if user_posts_count >= 3:
        return Response({"message": "Users are limited to 3 posts each in the closed beta."}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        post = serializer.save(author=request.user)

        # Process cast and crew emails
        for member in post.cast_and_crew:
            email = member.get('email')
            if email:
                # Check if email belongs to a registered user
                user_exists = UserAccount.objects.filter(email=email).exists()
                if not user_exists:
                    # Send email notification to the unregistered user
                    send_mail(
                        'You\'ve been tagged in a post on Indigen',
                        f'Hi, you have been tagged in a post titled "{post.title}". Visit our site to check it out!',
                        settings.EMAIL_HOST_USER,
                        [email],
                        fail_silently=False,
                    )

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_movie_detail(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        serializer = PostSerializer(post)
        return Response(serializer.data)
    except Post.DoesNotExist:
        return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_presigned_url(request):
    s3_client = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME
    )

    file_type = request.GET.get('file_type')
    upload_type = request.GET.get('upload_type', 'video')  # Default to 'video' if not specified
    unique_filename = f"{uuid.uuid4()}"

    key_prefix = 'videos/'
    if upload_type == 'trailer':
        key_prefix = 'trailers/'
    elif upload_type == 'thumbnail':
        key_prefix = 'thumbnails/'
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
@permission_classes([AllowAny])
def increment_views(request, post_id):
    post = get_object_or_404(Post, pk=post_id)
    if request.user.id != post.author.id:
        post.views += 1
        post.save(update_fields=['views'])
        return Response({'status': 'success', 'views': post.views})
    else:
        return Response({'status': 'no_change', 'message': 'Author views are not counted', 'views': post.views})

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def list_posts(request):
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_users(request):
    users = UserAccount.objects.all()
    serializer = UserCreateSerializer(users, many=True)
    return Response(serializer.data)
    
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
