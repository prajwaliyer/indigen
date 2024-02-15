from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone

class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save()

        return user
    

class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    followers = models.ManyToManyField('self', related_name='following', symmetrical=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def get_full_name(self):
        return self.first_name
    
    def get_short_name(self):
        return self.first_name
    
    def __str__(self):
        return self.email
    

class Post(models.Model):
    author = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    video_url = models.URLField(max_length=1024, null=True, blank=True)
    trailer_url = models.URLField(max_length=1024, null=True, blank=True)
    thumbnail_url = models.URLField(max_length=1024, null=True, blank=True)
    cast_and_crew = models.JSONField(default=list)
    location = models.CharField(max_length=255, null=True, blank=True)
    views = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title[:50]
