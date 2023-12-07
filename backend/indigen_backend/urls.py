from django.contrib import admin
from django.urls import path, include
from users.views import users_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', users_view),
]
