# Generated by Django 5.0 on 2024-01-19 23:46

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_post'),
    ]

    operations = [
        migrations.AddField(
            model_name='useraccount',
            name='followers',
            field=models.ManyToManyField(related_name='following', to=settings.AUTH_USER_MODEL),
        ),
    ]
