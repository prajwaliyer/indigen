from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from users import views as user_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.social.urls')),
    path('users/<int:user_id>/posts/', user_views.get_user_posts, name='get_user_posts'),
    path('posts/create/', user_views.create_post, name='create_post'),
    path('users/<int:user_id>/follow/', user_views.follow_user, name='follow_user'),
    path('users/<int:user_id>/unfollow/', user_views.unfollow_user, name='unfollow_user'),
    path('users/<int:user_id>/followers/', user_views.get_followers, name='get_followers'),
    path('users/<int:user_id>/following/', user_views.get_following, name='get_following'),
    path('get-presigned-url/', user_views.get_presigned_url, name='get_presigned_url'),
    path('users/list-posts/', user_views.list_posts, name='list_posts'),
    path('users/list-users/', user_views.list_users, name='list_users'),
    path('users/posts/<int:post_id>/', user_views.get_movie_detail, name='get_movie_detail'),
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]