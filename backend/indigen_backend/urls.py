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
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]